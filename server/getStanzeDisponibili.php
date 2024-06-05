<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");

checkSession();

$conn = apriConnessione("booking");

$codHotel=getValidParameter("codHotel", $conn);
$dataInizio=getValidParameter("dataInizio", $conn);
$dataFine=getValidParameter("dataFine", $conn);
$tipoStanza=getValidParameter("tipoStanza", $conn);

$sql= "SELECT COUNT(*)
        FROM prenotazioni
        Where codHotel=$codHotel
        and ((dataInizio between '$dataInizio' and '$dataFine')
        or (dataFine between '$dataInizio' and '$dataFine'))
        and tipoStanza = '$tipoStanza'";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();