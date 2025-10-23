<?php
$host = "localhost"; 
$user = "alfie";
$pass = "123Password";
$dbname = "simulator_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_reponse_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql  = "SELECT team_id, team_name, gls, ast FROM Teams";
$result = $conn->query($sql);

$teams = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $teams[] = $row;
    }
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
echo json_encode($teams, JSON_PRETTY_PRINT);

$conn->close();
?>