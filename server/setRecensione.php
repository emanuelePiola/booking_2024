<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");

checkSession();

$conn = apriConnessione("booking");

$codHotel=getValidParameter("codHotel", $conn);
$codUtente=getValidParameter("codUtente", $conn);
$stelle=getValidParameter("stelle", $conn);
$testoRecensione=getValidParameter("testoRecensione", $conn);
$date=getValidParameter("data", $conn);

$sql= "INSERT INTO recensioni (id, codHotel, codUtente, stelle, testoRecensione, data)
        VALUES (NULL, $codHotel, $codUtente, $stelle, '$testoRecensione', '$date');";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();