import random 

number_of_simulations = int(input("Enter the number of simulations to run: ")) # Allow the user to customise how many simulations they want to do 

teams = ['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',] # Just a small sample of teams to show the purpose 

season_results_list = [] # Placeholder to store season results

for sim in range(number_of_simulations):

    season = {team: random.randint(1, 20) for team in teams} # Simulate season results with random league positions 

    season_results_list.append(season) # Store the results of season 1

def calculate_probabilities(results): 
    probabilities = { team: {"Top 4": 0,"Win League": 0,"Relegated": 0} for team in teams } # Initialize counts for each team
    for res in results: 
        for team, pos in res.items():
            if pos == 1:
                probabilities[team]["Win League"] += 1
            if pos <= 4:
                probabilities[team]["Top 4"] += 1
            if pos >= 18:
                probabilities[team]["Relegated"] += 1

    # Convert counts to percentages
    for team in teams:
        for key in probabilities[team]:
            probabilities[team][key] = round(probabilities[team][key] / len(results) * 100, 2)
    return probabilities


print("Probabilities:")
for team, stats in calculate_probabilities(season_results_list).items():
    print(f"{team}: {stats}")