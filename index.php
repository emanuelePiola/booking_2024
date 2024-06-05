<!DOCTYPE html>

<html>

<head> 
    <title>Booking</title>
    <meta charset="UTF-8"> 
	<link rel="icon" href="img/icon.png" type="image/x-icon" />
	<link rel="stylesheet" href="lib/bootstrap.min.css" />
	<link rel="stylesheet" href="index.css" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.3.7/sweetalert2.all.min.js">
	</script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>       
	<script src="lib/jquery-3.5.1.min.js"></script> 	
	<script src="lib/axios@1.1.2.min.js"> </script>
	<script src="lib/bootstrap.bundle.min.js"> </script>
	<script src="lib/libreria.js"> </script>
	<script src="lib/environment.js"> </script>
	<script src="index.js"> </script>
</head>

<body>
  	<!-- Image and text -->
	<nav class="navbar">
	<a class="navbar-brand" href="#">
		<img src="img/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
		Booking
	</a>
	<a href="login.html"><img id="imgUtente" src="img/utenti/empty.png" width="30" height="30"></a>
	</nav>
  	<div class="container">
		<!-- ******************* SEZIONE 1 ******************** -->
		<div class="row">
			<div class="col-sm-1 col-md-2"> </div>
			<div class="col-sm-10 col-md-8 citta">
				<form class="form-inline">
					<div id="filtri"><div></div><a>Filtri</a></div>
					<input id="srcCitta" class="mr-sm-2" type="search" placeholder="Search the city where you want to stay" aria-label="Search">
					<div id="suggestions"></div>
				</form>	
			</div>	
			<div class="col-sm-1 col-md-2"> </div>
			
			<div class="col-md-1"> </div>
			<div class="col-sm-12 col-md-10 hotel">
				<!--
				<div>
				<div> 
					<img src="img/hotels/HotelLanghe1.jpg">
					<div>
						<h4>
							<span>Hotel Langhe</span>
							<img src="img/star.png">
							<img src="img/star.png">
							<img src="img/star.png">
						</h4>
						<p>Questo incantevole hotel, ospitato in un cascinale ristrutturato e circondato da un rigoglioso giardino, dista 2,6 km dal Duomo di Alba e 10 km dal Castello di Grinzane Cavour.</p>
						<img src="img/hotels/maps.png">
						<a href="#" class="btn btn-primary">Dettagli</a>
						<p>Prezzi a partire da <span class="prezzo">85€</span> a notte</p>
				</div>	
				</div
				<div>
					///map...
				</div>
				</div>	
				...
				-->
			</div>
			<div class="col-md-1"> </div>		
		</div>

		
		<!-- ******************* SEZIONE 2 ******************** -->
		<div class="row">
			<div class="col-sm-4 col-md-3 scegliDate">
				<p>
				<span>check-in</span><br>
				<input type="date" id="dataInizio" min="2024-01-01" max="2024-12-3" style="width:140px;">
				</p>
				<p>
				<span>check-out</span><br>
				<input type="date" id="dataFine" disabled max="2024-12-31"  style="width:140px;">
				</p>
				<p>
				<span>numero persone</span><br>
				<input type="number" id="nPersone" min="1" max="5" value="2" style="width:100%">
				</p>
				<p>
				<input type="checkbox" name="suites" id="chkSuites">
				<label name="suites">Suites</label>
				</p>
				<p>
				<br>
				<input id="btnBooking" type="button" class="btn btn-light" value="Prenota ora" style="width:100%">
				</p>
			</div>
			<div class="col-sm-8 col-md-9 dettagli">
				<!--
				<h3>Hotel Langhe </h3>
				<p>Strada Profonda 21 - 12051 Alba </p>
				<div>
					<img src="img/hotels/HotelLanghe1.jpg">
					<img src="img/hotels/HotelLanghe2.jpg">
					<img src="img/hotels/HotelLanghe3.jpg">		
				</div>
				<div>
					<p>Questo incantevole hotel, ospitato in un cascinale ristrutturato e circondato da un rigoglioso giardino, dista 2,6 km dal Duomo di Alba e 10 km dal Castello di Grinzane Cavour</p>
					<h3>Tariffe</h3>
					<p>dal 01-01-2024 al 15-03-2024 € 85</p>
					<p>dal 16-03-2024 al 10-06-2024 € 95</p>
					<p>dal 11-06-2024 al 10-09-2024 € 119</p>
					<p>dal 11-09-2024 al 15-10-2024 € 99</p>
					<p>dal 16-10-2024 al 31-12-2024 € 80</p>
				</div>
				-->
			</div>
		</div>
	</div>	
	
</body>
</html>