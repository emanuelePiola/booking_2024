"use strict"

$(document).ready(function(){
    $("#btnInvia").on("click", function(){
        const txtMail=$("#txtMail").val();
        if(txtMail != "" && txtMail.includes("@"))
        {
            inviaRichiesta("POST", "server/sendMail.php", {"mail": txtMail})
            .catch(errore)
            .then(function({data}){
                console.log(data);
                alert("Mail inviata correttamente");
                // window.location.href="login.html";
            })
        }
        else
        {
            alert("Inserire una mail valida");
        }
    });
});