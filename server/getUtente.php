<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");

checkSession();

$conn = apriConnessione("booking");

$username=getValidParameter("username", $conn);

$sql= "SELECT *
        FROM utenti
        Where username=$username";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();