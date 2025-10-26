<?php
// --- Allow CORS from any origin ---
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// --- Database connection ---
$host = "192.168.1.185"; 
$user = "alfie_desktop";
$pass = "password123";
$dbname = "simulatordb";

$conn = new mysqli($host, $user, $pass, $dbname);

// --- Check connection ---
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// --- Query ---
$sql  = "SELECT teamID, teamName, teamGls, teamAst FROM premier_league";
$result = $conn->query($sql);

$teams = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $teams[] = $row;
    }
}

// --- Output JSON ---
echo json_encode($teams, JSON_PRETTY_PRINT);

// --- Close connection ---
$conn->close();
?>
