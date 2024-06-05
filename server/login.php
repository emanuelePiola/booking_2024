<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione("booking");

$username = getValidParameter("username", $conn);
$psw = getValidParameter("password", $conn);

$sql = "SELECT *
        FROM utenti
        WHERE username = '$username'";
$data = eseguiQuery($conn, $sql);
if (count($data) == 0) {
    http_response_code(401);
    die("username non valido");
} else if ($data[0]["psw"] != $psw) {
    http_response_code(401);    
    die("password non valida");
}
createSession();
$_SESSION["codUtente"] = $data[0]["codUtente"];

http_response_code(200);
echo (json_encode($data));

$conn->close();
