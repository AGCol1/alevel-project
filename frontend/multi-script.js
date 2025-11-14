function calculateTeamStrength(team, maxGls, maxAst, maxDef) {
    const weightedAttack = ((team.teamGls / maxGls) * 50) + ((team.teamAst / maxAst) * 50);
    const defensiveFactor = (team.teamDef / maxDef);
    const randomFactor = (Math.random() * 5) * (1 - 0.3 * defensiveFactor);
    const goalEfficiency = team.teamGls / (team.teamAst + 1);
    const efficiencyBonus = goalEfficiency * 5;
    const defensiveAdjustment = (defensiveFactor * 10) - ((1 - defensiveFactor) * 3);
    const defensiveError = Number(team.teamErr);

    return weightedAttack + randomFactor + efficiencyBonus + defensiveAdjustment - defensiveError;
}

async function loadTeams() {
    try {
        const res = await fetch('http://localhost:8000/backend/getTeams.php');
        const data = await res.json();

        const maxGls = Math.max(...data.map(t => Number(t.teamGls)));
        const maxAst = Math.max(...data.map(t => Number(t.teamAst)));
        const maxDef = Math.max(...data.map(t => Number(t.teamDef)));

        const teams = data.map(team => {
            const teamStrength = calculateTeamStrength(team, maxGls, maxAst, maxDef);
            return {
                teamID: team.teamID,
                teamName: team.teamName,
                teamStrength,
                points: 0,
                wins: 0,
                draws: 0,
                losses: 0
            };
        });

        return teams;
    } catch (err) {
        console.error('Error loading teams:', err);
        return [];
    }
}

function generateFixtures(teams) {
    const fixtures = [];
    for (let i = 0; i < teams.length; i++) {
        const homeTeam = teams[i];
        for (let j = 0; j < teams.length; j++) {
            const awayTeam = teams[j];
            if (homeTeam.teamID !== awayTeam.teamID) {
                fixtures.push({ home: homeTeam, away: awayTeam });
            }
        }
    }
    return shuffleArray(fixtures);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function simulateMatch(home, away) {
    const homeFactor = 0.15 + Math.random() * 0.1;
    const awayFactor = 0.15 + Math.random() * 0.1;

    const strengthDifference = home.teamStrength - away.teamStrength;
    const strengthBonus = Math.max(0, strengthDifference) * 0.1;

    const adjustedHomeGoals = Math.round((home.teamStrength / 7 + strengthBonus) * homeFactor);
    const adjustedAwayGoals = Math.round((away.teamStrength / 10 - strengthBonus) * awayFactor);

    const homeGoals = Math.max(0, adjustedHomeGoals);
    const awayGoals = Math.max(0, adjustedAwayGoals);


    // Update points and record wins/draws/losses
    if (homeGoals > awayGoals) {
        home.points += 3;
        home.wins++;
        away.losses++;
    } else if (homeGoals < awayGoals) {
        away.points += 3;
        away.wins++;
        home.losses++;
    } else {
        home.points += 1;
        away.points += 1;
        home.draws++;
        away.draws++;
    }

    return {
        home: home.teamName,
        away: away.teamName,
        homeGoals,
        awayGoals
    };
}

function simulateSeason(teams, fixtures) {
    const matchResults = [];
    for (const match of fixtures) {
        const result = simulateMatch(match.home, match.away);
        matchResults.push(result);
    }

    return {matchResults};
}