$(document).one('pagecreate', function(){

	var pos = {};

	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(showWeather,showError);
	else
	Console.log("Geolocation Not supported by your browser!");

	function showWeather(position)
	{
		pos.latitude = position.coords.latitude;
		pos.longitude = position.coords.longitude;
		getCurrentWeatherInfo(pos.latitude, pos.longitude);
		getForecastWeather(pos.latitude, pos.longitude);
	}

	function getCurrentWeatherInfo(lat, long)
	{
		$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + pos.latitude + '&lon=' + pos.longitude + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
				.done(function(data){
					console.log(data);
					var temp = data.main.temp;
					console.log(temp);
					var locationName = data.name;
					console.log(locationName);
					var weather = data.weather;
					$.each(weather, function(key, weatherInfo){
						var desc = weatherInfo.description;
						console.log(desc);
					})
				})
				.fail(function(e){
					console.log(e);
				})

			//data puling complete, data needs to be put into HTML elements
	}

	function getCityWeatherInfo()
	{
		$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
				.done(function(data){
				
				})
				.fail(function(e){
					console.log(e);
				})
	}


	function getForecastWeather()
	{
		$.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + pos.latitude + '&lon=' + pos.longitude + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
				.done(function(data){
					console.log(data);
					var locationName = "Forecast location: " + data.city.name;
					console.log(locationName);
					$.each(data.list, function(key,forecastInfo){
						//var desc;
						console.log(forecastInfo.dt_txt);
					})
				})
				.fail(function(e){
					console.log(e);
				})

		//data pulling incomplete
	}

	function createChart()
	{

	}

	function showError()
	{

	}
});