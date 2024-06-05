<?php
header("Content-type: application/json; charset=utf-8");
session_start();
session_unset(); //rimuove tutte le varriabili di sessione
session_destroy();

http_response_code(200);
echo("ok");