<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");

checkSession();

$conn = apriConnessione("booking");

$codHotel=getValidParameter("codHotel", $conn);
$stanzaPrenotata=getValidParameter("keyPrenotate", $conn);
$newValue=getValidParameter("newValue", $conn);

$updateSql= "UPDATE hotel
        SET $stanzaPrenotata = $newValue
        Where codHotel=$codHotel";
$update = eseguiQuery($conn, $updateSql);

$codUtente=getValidParameter("codUtente", $conn);
$dataInizio=getValidParameter("dataInizio", $conn);
$dataFine=getValidParameter("dataFine", $conn);
$nPersone=getValidParameter("nPersone", $conn);
$prezzoPerPersona=getValidParameter("prezzoPerPersona", $conn);
$tipoStanza=getValidParameter("tipoStanza", $conn);

$sql="INSERT INTO prenotazioni (codHotel, codUtente, dataInizio, dataFine, nPersone, prezzoPerPersona, tipoStanza)
        VALUES($codHotel, $codUtente, '$dataInizio', '$dataFine', $nPersone, $prezzoPerPersona, '$tipoStanza');";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();