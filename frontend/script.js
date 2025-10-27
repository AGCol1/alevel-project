
 function calculateTeamStrength(team, maxGls, maxAst, maxDef) {
    // This calculates the teams attacking strength 
    const weightedAttack = ((team.teamGls / maxGls) * 50) + ((team.teamAst / maxAst) * 50);
    // This calculates the teams defensive strength 
    const defensiveFactor = (team.teamDef / maxDef);
    // This adds a random factor to introduce variability in team strength
    const randomFactor = (Math.random() * 5) * (1 - 0.3 * defensiveFactor);
    // This calculates the teams goal efficiency to reward teams that score more with assists
    const goalEfficiency = team.teamGls / (team.teamAst + 1);
    const efficiencyBonus = goalEfficiency * 5;
    // This adjusts the team strength based on defensive capabilities
    const defensiveAdjustment = (defensiveFactor * 10) - ((1 - defensiveFactor) * 3);

    const defensiveError = Number(team.teamErr) 
    // Final team strength calculation combining all factors
    const teamStrength = weightedAttack + randomFactor + efficiencyBonus + defensiveAdjustment - defensiveError;


    return teamStrength;


} 

async function loadTeams() { // Create the function to load the teams data from the backend
    try { // Try to fetch the data 
        const res = await fetch('http://localhost:8000/backend/getTeams.php'); // Fetches the data from the backend PHP script
        const data = await res.json(); // Parses the JSON data fom the response 

        // Find the max goals and assists for the normalisation feature 
        const maxGls = Math.max(...data.map(t => Number(t.teamGls)));
        const maxAst = Math.max(...data.map(t => Number(t.teamAst)));
        const maxDef = Math.max(...data.map(t => Number(t.teamDef)));
        const teamErr = data.map(t => Number(t.teamErr) || 0);

        // Mapping the raw data to team objects with the calculated strength from the calculateTeamStrength function
        const teams = data.map(team => {
            const teamStrength = calculateTeamStrength(team, maxGls, maxAst, maxDef, teamErr);
            return {
                teamID: team.teamID,
                teamName: team.teamName,
                teamStrength: teamStrength,
                points: 0, // Initialising the points
                goalsFor: 0, // Initialising goals for
                goalsAgainst: 0, // Initialising goals against
                matchesPlayed: 0 // Initialising matches played 
            };
        });

        return teams;
    } catch (err) {
        console.error('Error loading teams:', err); // Catch any errors and log them to the console 
        return [];
    }
}


function generateFixtures(teams) {
    const fixtures = []; // Create the fixures array 

    for (let i = 0; i < teams.length; i++) { // Loop through each team to create home and away fixtures
        const homeTeam = teams[i]; // Set the home team
        for (let j = 0; j < teams.length; j++) { // Loop through each team again to set the away team
            const awayTeam = teams[j]; // Set the away team
            if (homeTeam.teamID !== awayTeam.teamID) { // Ensure a team does not play against itself
                fixtures.push({ // Push the fixture to the fixtures array
                    home: homeTeam, // Set the home team
                    away: awayTeam, // Set the away team
                });
            }

        }
    }

    return shuffleArray(fixtures); // Shuffle the fixtures to randomise the order

}

function shuffleArray(array) { // Function to shuffle an array using the Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) { // Loop through the array backwards
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap the elements at the two indices
    }
    return array;
}


function simulateMatch(home, away) {
    const homeFactor = 0.15 + Math.random() * 0.1; // Home team factor 
    const awayFactor = 0.15 + Math.random() * 0.1; // Away team factor

    const strengthDifference = home.teamStrength - away.teamStrength; // Calculate the strength difference
    const strengthBonus = Math.max(0, strengthDifference) * 0.1; // Bonus based on strength difference

    const adjustedHomeGoals = Math.round((home.teamStrength / 7 + strengthBonus) * homeFactor); // Adjusted goals for home team
    const adjustedAwayGoals = Math.round((away.teamStrength / 10 - strengthBonus) * awayFactor); // Adjusted goals for away team

    const homeGoals = Math.max(0, adjustedHomeGoals); // Ensure goals are not negative
    const awayGoals = Math.max(0, adjustedAwayGoals); // Ensure goals are not negative

    // UPDATE HOME TEAM STATS 

    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    home.matchesPlayed++;

    // UPDATE AWAY TEAM STATS

    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;
    away.matchesPlayed++;

    // Logic to update points based on match result 

    if (homeGoals > awayGoals) {
        home.points += 3; // Home team wins
    } else if (homeGoals < awayGoals) {
        away.points += 3; // Away team wins
    } else {
        home.points += 1; // Draw
        away.points += 1; // Draw
    }
    return {
        home: home.teamName,
        away: away.teamName,
        homeGoals,
        awayGoals
    };

}

function simulateSeason(teams, fixtures) {
    const matchResults = []; // Array to hold match results

    for (const match of fixtures) {
        const result = simulateMatch(match.home, match.away); // Simulate each match
        matchResults.push(result); // Store the result
    }

    const leagueTable = [...teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points; // Sort by points
        const goalDifferenceA = a.goalsFor - a.goalsAgainst;
        const goalDifferenceB = b.goalsFor - b.goalsAgainst;
        if (goalDifferenceB !== goalDifferenceA) return goalDifferenceB - goalDifferenceA; // Then by goal difference
        return b.goalsFor - a.goalsFor; // Finally by goals scoredS
    });
    return {
        leagueTable, matchResults
    };
}

async function runSimulation() {
    const teams = await loadTeams(); // Load the teams data
    const fixtures = generateFixtures(teams); // Generate the fixtures
    const { leagueTable, matchResults } = simulateSeason(teams, fixtures); // Simulate the season

    const output = document.getElementById('output'); // Get the output element
    output.textContent = "Final League Table:\n"; // Display the final league table header

    leagueTable.forEach((team, index) => { // Loop through each team in the league table
        output.textContent += `${index + 1}. ${team.teamName} - Points: ${team.points}, Goals For: ${team.goalsFor}, Goals Against: ${team.goalsAgainst}\n`;
    });

    console.log('Match Results:', matchResults); // Log the match results to the console

}

runSimulation();

