<?php
header("Access-Control-Allow-Origin: *"); // Allows CORS from any origin
header("Content-Type: application/json; charset=UTF-8"); // Allows CORS from any origin

// --- Database connection ---
$host = "192.168.5.117";  /* This is the IP address of the Raspberry Pi also known as the host of 
                             where the database is located on the network */

$user = "alfie_desktop"; /* This is the name of the person who wishes to acccess the database 
                         which in my case is my desktop which was named as "alfie_desktop" 
                         when granting permissions on the Raspberry Pi and documented on my project  */

$pass = "password123"; /* This is the password associated with the user "alfie_desktop" 
                         which was also set when granting permissions on the Raspberry Pi */

$dbname = "simulatordb"; /* This is the name of the database which stores the premier_league 
                            table on the Pi */ 

$conn = new mysqli($host, $user, $pass, $dbname); // Creates the connection to the DB 

if ($conn->connect_error) {    // This checks if the connection to the database was 
    http_response_code(500);    // successful or not and if it is not it will return an error message 
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
} 

$sql  = "SELECT teamID, teamName, teamGls, teamAst, teamDef, teamErr FROM premier_league"; 
$result = $conn->query($sql); /* This is the SQL query made to the Database and selects the 
                               teamID, teamName, teamGls and teamAst columns from the 
                               premier_league table */

$teams = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $teams[] = $row;
    }
} // This fetches the results of the query and stores them in an array, there is no need 
    // for an else statement as there is no chance of an empty array being returned. 

echo json_encode($teams, JSON_PRETTY_PRINT); 
// Encodes the array into JSON format and outputs it to the webpage. 

$conn->close(); // Closes the connection to the database. 
?> 
