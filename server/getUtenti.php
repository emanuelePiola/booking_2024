<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");

checkSession();
if(!isset($_SESSION["codUtente"]))
{
        http_response_code(403);
        die("sessione inesistente");
}

$conn = apriConnessione("booking");

$codUtente=$_SESSION["codUtente"];

$sql= "SELECT *
        FROM utenti
        Where codUtente = $codUtente";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();