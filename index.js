'use strict'

$(document).ready(function(){

    let sezione1 = $(".row").eq(0);
    let sezione2 = $(".row").eq(1).hide();

	let sezHotel = $(".hotel");
	let sezDettagli = $(".dettagli");

	let filtersContent=["piscina", "spa", "colazione Inclusa", "cena Inclusa", "suites"]

	impostaUtente();

	$("nav a").on("click", function(){
		sezione1.show();
		sezione2.hide();
		$("#srcCitta").val("");
		$("#suggestions").empty();
		sezHotel.empty();
	});

	$("#filtri a").on("click", function(){
		if($("#filtri div").html() == "")
		{
			for (const item of filtersContent) {
				$("#filtri div").append($("<span>").text(item).val("").on("click", filters));
			}
		}
		else
		{
			$("#filtri div").empty();
		}
	});

	function filters()
	{
		if($(this).val() == "")
		{
			$(this).css({"color": "#35706d"});
			$(this).val("clicked");
		}
		else
		{
			$(this).css({"color": "white"});
			$(this).val("");
		}
	}

	$("#srcCitta").on("input", function(){
        let keyword=$(this).val();
		$("#suggestions").empty();
        if(keyword.length>=2)
        {
			caricaCitta(keyword);
        }
    });

	function impostaUtente()
	{
		inviaRichiesta("GET", "server/getUtenti.php")
		.catch(errore)
		.then(function({data}){
			console.log(data);
			let utenti = data[0];
			$("#imgUtente").prop("src", "img/utenti/" + utenti["imgProfilo"])
			.on("error", function(){
				$(this).prop({"src":"img/utenti/empty.png"});
			})
		});
	}

	function caricaCitta(keyword)
	{
		inviaRichiesta("GET", "server/getCitta.php")
		.catch(errore)
		.then(function({data}){
			data.forEach(function(item){
				if(item["citta"].substring(0,keyword.length).toLowerCase() == keyword.toLowerCase() && item["citta"].length>=keyword.length)
				{
					$("#suggestions").append($("<p>").text(item["citta"])
					.on("click", function(){
						mostraHotel(item["citta"]);
					}));	
				}
			});
		});
	}

	function mostraHotel(citta)
	{
		sezHotel.empty();
		let filters=[];
		if($("#filtri div").html() != "")
		{
			for (const filtro of $("#filtri div").children("span")) {
				if($(filtro).val() == "clicked")
				{
					filters.push($(filtro).text());
				}
			}
		}
		else
		{
			for (const filtro of filtersContent) {
				filters.push(filtro);
			}
		}
		console.log(filters);
		inviaRichiesta("GET", "server/getHotel.php", {citta})
		.catch(errore)
		.then(function({data}){
			console.log(data);

			data.forEach(function(item){
				if(isToShow(filters, item))
				{
					console.log("codice hotel: ", item["codHotel"])
					inviaRichiesta("GET", "server/getTariffe.php", {"codHotel": item["codHotel"]})
					.catch(errore)
					.then(function({data}){
						let h4 = $("<h4>")
						.append($("<span>").text(item["nomeHotel"]));
						for(let i=0; i<item["stelle"]; i++)
						{
							h4.append($("<img>").prop("src", "img/star.png"));
						}

						let prezzo=Number.MAX_SAFE_INTEGER;
						if(data.length>0)
						{
							for (let i = 0; i < data.length; i++) {
								if(parseFloat(data[i]["prezzo"])<prezzo)
								{
									prezzo=parseFloat(data[i]["prezzo"]);
								}
							}
						}
						else
						{
							prezzo="N/D"
						}

						let p = $("<p>").html("Prezzi a partire da <span class='prezzo'>" + prezzo + "€</span> a notte")
						
						$("<div>")
						.appendTo(sezHotel)
						//.append($("<div>").css({"background-image": "url(img/hotels/" + item["img"] + ")", "width":  "215px", "height": "160px", "background-position": "center", "background-size": "contain", "background-repeat": "no-repeat"}))
						.append($("<div>")
						.append($("<img>").prop({"src": "img/hotels/" + item["img"]}))
						.append($("<div>")
						.append(h4)
						.append($("<p>").text(item["descrizione"]))
						.append($("<a>").prop({"href": "#", "hotel": item, "tariffe": data}).addClass("btn btn-outline-dark").text("Dettagli")
						.on("click", visualizzaDettagli))
						.append($("<img>").prop({"src": "img/hotels/maps.png", "id": "btnMap", "hotel": item})
						.on("click", generaMappa))
						.append(p)))
						.append($("<div>").prop({"id": "mapContainer_" + item["codHotel"]}).addClass("mapContainers").hide());
					})
				}
			});
		});
	}

	function isToShow(filters, item)
	{
		let isToShow=false;
		for (const filtro of filters) {
			if(filtro == "suites")
			{
				if(item[filtro]>0)
				{
					isToShow=true;
					break;
				}
			}
			else
			{
				if(item[filtro.replace(" ", "")]==1)
				{
					isToShow=true;
					break;
				}
			}
		}
		return isToShow;
	}

	async function generaMappa()
	{let hotel = $(this).prop("hotel");

		let mapContainer =$("#mapContainer_" + hotel["codHotel"]).get(0);
		
		if($(mapContainer).html() == "")
		{
			await googleMapsUpload();
		
			// E' bene istanziarlo UNA SOL VOLTA all'inizio
			let geocoder = new google.maps.Geocoder();

			geocoder.geocode({"address": hotel["indirizzo"] + ", " + hotel["citta"]}, function(results, status){
				if(status==google.maps.GeocoderStatus.OK)
				{
					console.log(results[0]);
					const mapOption={
						center: results[0]["geometry"]["location"],
						zoom: 17.3
					};
					const map= new google.maps.Map(mapContainer, mapOption);

					const markerOptions={
						map,
						position: results[0]["geometry"]["location"],
						title: hotel["nomeHotel"],
					};
					const  marcker= new google.maps.Marker(markerOptions);
		
					$(mapContainer).show();
				}
				else
				{
					setAlert("Stringa inserita non valida");
				}
			});
		}
		else
		{
			$(mapContainer).empty();
			$(mapContainer).hide();
		}
	}

	function visualizzaDettagli()
	{
		sezione1.hide();
		sezione2.show();
		$(".dettagli").empty();

		let hotel = $(this).prop("hotel");
		let tariffe = $(this).prop("tariffe");

		inviaRichiesta("GET", "server/getFoto.php", {"codHotel": hotel["codHotel"]})
		.catch(errore)
		.then(function({data}){
			let Immagini = data;
			inviaRichiesta("GET", "server/getRecensioni.php", {"codHotel": hotel["codHotel"]})
			.catch(errore)
			.then(function({data}){
				let recensioni = data;

				$("#dataInizio").prop("min", getCurrentDate());
			
				//creazione carousel
				/*<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
					<div class="carousel-inner">
						<div class="carousel-item active">
						<img src="..." class="d-block w-100" alt="...">
						</div>
						<div class="carousel-item">
						<img src="..." class="d-block w-100" alt="...">
						</div>
						<div class="carousel-item">
						<img src="..." class="d-block w-100" alt="...">
						</div>
					</div>
					<button class="carousel-control-prev" type="button" data-target="#carouselExampleIndicators" data-slide="prev">
						<span class="carousel-control-prev-icon" aria-hidden="true"></span>
						<span class="sr-only">Previous</span>
					</button>
					<button class="carousel-control-next" type="button" data-target="#carouselExampleIndicators" data-slide="next">
						<span class="carousel-control-next-icon" aria-hidden="true"></span>
						<span class="sr-only">Next</span>
					</button>

					divImg.append($("<img>").prop("src", "img/hotels/" + item["url"]));
				</div>*/
				let divCarouselIndicators = $("<div>").css({"width": "300px", "height": "200px", "margin": "0 auto"}).prop({"id": "carouselIndicators"}).attr("data-ride", "carousel").addClass("carousel slide");
				let carouselInner = $("<div>").addClass("carousel-inner").appendTo(divCarouselIndicators);
				Immagini.forEach(function(item, i){
					let divImg = $("<div>").addClass("carousel-item").appendTo(carouselInner);
					if(i==0)
					{	
						divImg.addClass("active")
					}
					//divImg.append($("<img>").prop({"src": "img/hotels/" + item["url"], "alt": "ERRORE - Immagine non trovata"}).addClass("d-block w-100"));
					divImg.append($("<div>").css({"background-image": "url(img/hotels/" + item["url"] + ")", "width": "100%", "height": "200px", "background-position": "center", "background-size": "contain", "background-repeat": "no-repeat"}).addClass("d-block w-100"));
				})
				let btnPrev = $("<button>").addClass("carousel-control-prev").prop({"type": "button"}).attr({"data-target": "#carouselIndicators", "data-slide": "prev"}).css({"border": "none"}).appendTo(divCarouselIndicators);
				$("<span>").addClass("carousel-control-prev-icon").attr({"aria-hidden": true}).appendTo(btnPrev);
				$("<span>").addClass("sr-only").text("Previous").appendTo(btnPrev);
				let btnNext = $("<button>").addClass("carousel-control-next").prop({"type": "button"}).attr({"data-target": "#carouselIndicators", "data-slide": "next"}).css({"border": "none"}).appendTo(divCarouselIndicators);
				$("<span>").addClass("carousel-control-next-icon").attr({"aria-hidden": true}).appendTo(btnNext);
				$("<span>").addClass("sr-only").text("Next").appendTo(btnNext);

				//contenuto dettagli
				let divSpecifiche=$("<div>");
				let imgWifi;
				if(hotel["wifi"]==1) imgWifi = $("<img>").prop({"src": "img/hotels/check.png"});
				else imgWifi = $("<img>").prop({"src": "img/hotels/x.png"});
				let imgPiscina;
				if(hotel["piscina"]==1) imgPiscina = $("<img>").prop({"src": "img/hotels/check.png"});
				else imgPiscina = $("<img>").prop({"src": "img/hotels/x.png"});
				let imgSpa;
				if(hotel["spa"]==1) imgSpa = $("<img>").prop({"src": "img/hotels/check.png"});
				else imgSpa = $("<img>").prop({"src": "img/hotels/x.png"});
				let imgColazione;
				if(hotel["colazioneInclusa"]==1) imgColazione = $("<img>").prop({"src": "img/hotels/check.png"});
				else imgColazione = $("<img>").prop({"src": "img/hotels/x.png"});
				let imgCena;
				if(hotel["cenaInclusa"]==1) imgCena = $("<img>").prop({"src": "img/hotels/check.png"});
				else imgCena = $("<img>").prop({"src": "img/hotels/x.png"});

				let table=$("<table>").appendTo(divSpecifiche);
				table.append($("<tr>")
					.append($("<th>").text("Wi-Fi"))
					.append($("<td>").append(imgWifi)))
				.append($("<tr>")
					.append($("<th>").text("Piscina"))
					.append($("<td>").append(imgPiscina)))
				.append($("<tr>")
					.append($("<th>").text("Spa"))
					.append($("<td>").append(imgSpa)))
				.append($("<tr>")
					.append($("<th>").text("Colazione Inclusa"))
					.append($("<td>").append(imgColazione)))
				.append($("<tr>")
					.append($("<th>").css({"border-bottom": "none"}).text("Cena Inclusa"))
					.append($("<td>").css({"border-bottom": "none"}).append(imgCena)));

				
				let divTariffe = $("<div>").prop("id", "tariffe").append($("<h3>").text("Tariffe"));
				if(tariffe.length>0)
				{
					tariffe.forEach(function(item){
						divTariffe.append($("<p>").text("dal " + item["dataInizio"] + " al " + item["dataFine"] + " € " + item["prezzo"]));
					});
				}
				else
				{
					divTariffe.append($("<p>").text("Non esistono tariffe disponibili per questo hotel, al momento"));
				}

				let divCamere = $("<div>").prop("id", "camere")
				.append($("<h3>").text("Camere"))
				.append($("<p>").text("Singole: " + parseInt(hotel["stanzeSingole"]-hotel["singolePrenotate"])))
				.append($("<p>").text("Doppie: " + parseInt(hotel["stanzeDoppie"]-hotel["doppiePrenotate"])))
				.append($("<p>").text("Triple: " + parseInt(hotel["stanzeTriple"]-hotel["triplePrenotate"])))
				.append($("<p>").text("Quadruple: " + parseInt(hotel["stanzeQuadruple"]-hotel["quadruplePrenotate"])))
				.append($("<p>").text("Suites: " + parseInt(hotel["suites"]-hotel["suitesPrenotate"])))

				let divContenuto = $("<div>").prop("id", "contenuto")
				.append($("<p>").text(hotel["descrizione"]))
				.append(divSpecifiche)
				.append($("<div>")
				.append(divTariffe)
				.append(divCamere));

				//recensioni
				let recensioniContainer=$("<div>");
				if(recensioni.length>0)
				{
					recensioni.forEach(function(item){
						let div=$("<div>").appendTo(recensioniContainer).append($("<p>").text(item["testoRecensione"]));
						for(let i=0; i<item["stelle"]; i++)
						{
							div.append($("<img>").prop("src", "img/star.png"));
						}
					});
				}
				else
				{
					$("<p>").text("Non ci sono Recensioni disponibili").appendTo(recensioniContainer);
				}

				inviaRichiesta("GET", "server/getUtenti.php")
				.catch(errore)
				.then(function({data}){
					let img=$("<img>").prop({"src": "img/utenti/" + data[0]["imgProfilo"], "id": "utente", "codUtente": data[0]["codUtente"]})
					.on("error", function(){
						$(this).prop({"src":"img/utenti/empty.png"});
					})
					let recensioniInsert=$("<div>")	
					.append(img)
					.append($("<div>").text("0").prop("id", "starNumber")
					.on("click", function(){
						if(parseInt($(this).text())<5)
						{
							$(this).text(parseInt(parseInt($(this).text()) + 1));
						}
						else
						{
							$(this).text("0");
						}
					}))
					.append($("<input>").prop({"type": "text", "id": "testoRecensione"}))
					.append($("<button>").addClass("btn btn-outline-dark").text("Invia")
					.on("click", inviaRecensione));

					let divRecensioni=$("<div>").prop("id", "recensioni")
					.append($("<h3>").text("Recensioni"))
					.append(recensioniContainer)
					.append(recensioniInsert);

					//dettagli
					sezDettagli
					.append($("<h3>").text(hotel["nomeHotel"]).prop({"id": "hotelName", "codHotel": hotel["codHotel"]}))
					.append($("<p>").text(hotel["indirizzo"]))
					.append(divCarouselIndicators)
					.append(divContenuto)
					.append(divRecensioni);
				});
			});
		});
	}

	function inviaRecensione()
	{
		let codHotel = $("#hotelName").prop("codHotel");
		let codUtente = $("#utente").prop("codUtente");
		let stelle = parseInt($("#starNumber").text());
		let testoRecensione = $("#testoRecensione").val();
		let data = getCurrentDate();

		if(testoRecensione!="" && stelle>0)
		{
			inviaRichiesta("POST", "server/setRecensione.php", {codHotel, codUtente, stelle, testoRecensione, data})
			.catch(errore)
			.then(function({data}){
				setAlert("Recensione inserita correttamente!!");
				$("#starNumber").text("0");
				$("#testoRecensione").val("")
			});
		}
		else
		{
			setAlert("Inserisci tutti i parametri per inviare una nuova recensione!!");
		}
	}

	$("#dataInizio").on("change", function(){
		$("#dataFine").prop("disabled", false);
		$("#dataFine").prop("min", $(this).val());
	});

	$("#btnBooking").on("click", function(){
		let codHotel = $("#hotelName").prop("codHotel");
		let codUtente = $("#utente").prop("codUtente");
		let dataInizio = $("#dataInizio").val();
		let dataFine = $("#dataFine").val();
		let nPersone = $("#nPersone").val();
		if(dataInizio!="" && dataFine!="")
		{
			let tipoStanza;
			let stanze=["singola", "doppia", "tripla", "quadrupla"]
			if($("#chkSuites").prop("checked"))
			{
				tipoStanza="suites";
			}
			else
			{
				tipoStanza=stanze[(nPersone-1)]
			}
			let prezzoPerPersona;
			inviaRichiesta("GET", "server/getTariffe.php", {codHotel})
			.catch(errore)
			.then(function({data}){
				console.log(data);
				let meseInizio=dataInizio.split('-')[1];
				let meseFine=dataFine.split('-')[1];
				let giornoInizio=dataInizio.split('-')[2];
				let giornoFine=dataFine.split('-')[2];
				for (const item of data) {
					let meseInizioTariffa=item["dataInizio"].split('-')[1];
					let giornoInizioTariffa=item["dataInizio"].split('-')[2];
					let meseFineTariffa=item["dataFine"].split('-')[1];
					let giornoFineTariffa=item["dataFine"].split('-')[2];
					if(meseInizio>=meseInizioTariffa && meseInizio<=meseFineTariffa)
					{
						if(meseInizio==meseInizioTariffa)
						{
							if(giornoInizio>=giornoInizioTariffa)
							{
								prezzoPerPersona=item["prezzo"];
								break;
							}
						}
						else if(meseInizio==meseFineTariffa)
						{
							if(giornoInizio<giornoFineTariffa)
							{
								prezzoPerPersona=item["prezzo"];
								break;
							}
						}
						else
						{
							prezzoPerPersona=item["prezzo"];
							break;
						}
					}
				}
				console.log(codHotel, codUtente, dataInizio, dataFine, nPersone, tipoStanza, prezzoPerPersona)
			
				inviaRichiesta("GET", "server/getHotelCod.php", {codHotel})
				.catch(errore)
				.then(function({data}){
					let hotel = data[0];
					inviaRichiesta("GET", "server/getStanzeDisponibili.php", {codHotel, dataInizio, dataFine, tipoStanza})
					.catch(errore)
					.then(function({data}){
						console.log(data);
						let nPrenotazioni = data[0]["COUNT(*)"]
						let keyStanze;
						let keyPrenotate;
						if(tipoStanza=="suites")
						{
							keyStanze=tipoStanza;
							keyPrenotate = tipoStanza + "Prenotate";
						}
						else
						{
							keyStanze="stanze" + tipoStanza[0].toUpperCase() + tipoStanza.slice(1);
							keyStanze = keyStanze.substring(0, keyStanze.length-1) + "e";
							keyPrenotate = tipoStanza.substring(0, tipoStanza.length-1) + "e" + "Prenotate";
						}
						console.log(nPrenotazioni, keyStanze)
						if(nPrenotazioni<hotel[keyStanze])
						{
							let newValue = parseInt(hotel[keyPrenotate]+1);
							console.log(newValue, hotel[keyPrenotate]);
							inviaRichiesta("GET", "server/prenotaStanza.php", {codHotel, keyPrenotate, newValue, codUtente, dataInizio, dataFine, nPersone, prezzoPerPersona, tipoStanza})
							.catch(errore)
							.then(function({data}){
								let nGiorni= 30*(meseFine - meseInizio) + (giornoFine - giornoInizio);
								let prezzoTotale=nPersone * prezzoPerPersona * nGiorni;
								console.log(prezzoTotale);
								
								basicSweetAlert("LA PRENOTAZIONE E' ANDATA A BUON FINE", "La prenotazione per " + nPersone + " persone corrispondente a " + nGiorni + " giorni di soggiorno risulta in un prezzo totale di: " + prezzoTotale + "€", "success", 400, "#f5dac4", false)
							});
						}
						else
						{
							setAlert("Siamo spiacenti, non ci sono camere disponibili per " + nPersone + " persone nel periodo specificato");
						}
					});
				});
				
			});
		}
		else
		{
			setAlert("ERRORE - inserire le date di inizio e fine del soggiorno!!");
		}
	});
});




