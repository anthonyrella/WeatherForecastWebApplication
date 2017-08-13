$(document).one('pagecreate', function () {


	updateWeatherCurrentLocation();


});

function updateWeatherCurrentLocation() {


	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(showWeather, showError);
	else
		Console.log("Geolocation Not supported by your browser!");

}


function showWeather(position) {
	var pos = {};
	pos.latitude = position.coords.latitude;
	pos.longitude = position.coords.longitude;
	getCurrentWeatherInfo(pos.latitude, pos.longitude);
	getForecastWeather(pos.latitude, pos.longitude);
}


function getCurrentWeatherInfo(lat, long) {
	$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
		.done(function (data) {
			console.log(data);
			var temp = data.main.temp + " &#8451;";
			console.log(temp);
			var locationName = data.name;
			console.log(locationName);
			var weather = data.weather[0].description;
			console.log(weather);

			var weatherDescription = $('#icon');

			$("#temp").append(temp);
			$("#city").append(locationName);
			$("#description").append(weather);

			var imageUrl = '../Final Project/resources/images/cloud.png';

		//need to add all possible weather descriptions. Just a test
			switch (weather) {
				case 'few clouds':
					weatherDescription.attr('src', imageUrl);
					break;
				case 'few clouds':
					weatherDescription.attr('src', imageUrl);
					break;
				default:
					weatherDescription.attr('src', imageUrl);
			}

		})
		.fail(function (e) {
			console.log(e);
		})



}

function getCityWeatherInfo(cityName) {
	$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
		.done(function (data) {

			console.log(data);
			var temp = data.main.temp + " &#8451;";
			console.log(temp);
			var locationName = data.name;
			console.log(locationName);
			var weather = data.weather[0].description;
			console.log(weather);

			var weatherDescription = $('#icon');

			$("#temp").append(temp);
			$("#city").append(locationName);
			$("#description").append(weather);

			
			var imageUrl = '../Final Project/resources/images/cloud.png';

			//need to add all possible weather descriptions. Just a test
			switch (weather) {
				case 'few clouds':
					weatherDescription.attr('src', imageUrl);
					break;
				case 'few clouds':
					weatherDescription.attr('src', imageUrl);
					break;
				default:
					weatherDescription.attr('src', imageUrl);
			}

		})
		.fail(function (e) {
			console.log(e);
		})
}


function getForecastWeather(lat, long) {
	$.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
		.done(function (data) {
			console.log(data);
			var locationName = "Forecast location: " + data.city.name;
			console.log(locationName);
			$.each(data.list, function (key, forecastInfo) {
				//var desc;
				console.log(forecastInfo.dt_txt);
			})
		})
		.fail(function (e) {
			console.log(e);
		})

	//data pulling incomplete
}

function createChart() {

}

function showError() {

}

$(document).on('click', '#refresh', function () {

	$("#temp").html("");
	$("#city").html("");
	$("#description").html("");
	updateWeatherCurrentLocation();

	var now = new Date($.now());
	var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

	$('#timestamp').html("&nbsp; Updated on " + formatted);


})

$(document).on('click', '#searchCity', function () {

	$("#search").toggle();
	$('#search').val("");
});


$(document).on('keypress', '#search', function (e) {
	var key = e.which;
	if (key == 13) // the enter key code
	{
		var search = $('#search').val();
		$('#search').val("");

		//use this value to search by city
		console.log(search);
		$("#temp").html("");
		$("#city").html("");
		$("#description").html("");
		$("#icon").attr('src', "");

		getCityWeatherInfo(search);

	}
});