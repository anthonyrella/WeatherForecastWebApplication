$(document).one('pagecreate', function () {

	var search = $('#search');
	var recent = $('#recent');
	var searchVal;
	updateWeatherCurrentLocation();
	search.parent("div").hide();
	var savedSearches = new Array;
	loadSavedCities();



	//will call method to search for current gps location
	function updateWeatherCurrentLocation() {


		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(showWeather, showError);
		else
			Console.log("Geolocation Not supported by your browser!");

	}

	//finds gps location and calls method to run ajax for weather api
	function showWeather(position) {
		var pos = {};
		pos.latitude = position.coords.latitude;
		pos.longitude = position.coords.longitude;
		getCurrentWeatherInfo(pos.latitude, pos.longitude);
		getForecastWeather(pos.latitude, pos.longitude);
	}

	//ajax call to weather api and displays current location values to homepage
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
	//ajax call to weather api by city name and displays weather information to homepage
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

	//ajax call to weather api for 5 day forecast and displays weather information to homepage
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

	//will refresh city if city has been entered in seach. Else will refresh current location	
	$(document).on('tap', '#refresh', function () {

		$("#temp").html("");
		$("#city").html("");
		$("#description").html("");
		if (searchVal) {
			getCityWeatherInfo(searchVal);
		} else {
			updateWeatherCurrentLocation();
		}

		var now = new Date($.now());
		var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

		$('#timestamp').html("&nbsp; Updated on " + formatted);


	})

	//toggles search city bar
	$(document).on('tap', '#searchCity', function () {
		search = $('#search');
		search.toggle();
		search.parent("div").toggle()
		search.val("");
	});

	//accepts entered value from search by pressing enter and calls method to run weather api by city
	$(document).on('keypress', '#search', function (e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{
			searchVal = search.val();
			search.val("");
			$("#temp").html("");
			$("#city").html("");
			$("#description").html("");
			$("#icon").attr('src', "");

			getCityWeatherInfo(searchVal);

			searchedCityStorage(searchVal);

		}
	});

	//pushes recent city search to object and local storage and prepends latest city search to top of recent city search list
	function searchedCityStorage(searchVal) {

		if (savedSearches == null) {
			savedSearches = [searchVal];
		} else {
			savedSearches.push(searchVal);
		}

		localStorage.setItem("searchedCity", JSON.stringify(savedSearches));

		savedSearches = JSON.parse(localStorage.getItem("searchedCity"));

		var latestSearch = savedSearches[savedSearches.length - 1];

		//little bug: when running app for first time, with no searches in local storage, before you navigate to cities page if you make a search you get some console errors, but app still works fine. Probably because im trying to refresh data page without being on it?
		recent.prepend("<li><a id='citySearch'>" + latestSearch + "</a></li>");
			recent.listview("refresh");

	}

	//loads local storage to populate recent city search
	function loadSavedCities() {

		savedSearches = JSON.parse(localStorage.getItem("searchedCity"));

		if (savedSearches != null) {
			savedSearches.forEach(function (latestSearch) {

				recent.prepend("<li><a id='citySearch'>" + latestSearch + "</a></li>");

			})
		}

	}
	//select city from city page and return to homepage with weather information
	$(document).on('tap', '#citySearch', function () {

		var city = $(this).html();
		$("#temp").html("");
		$("#city").html("");
		$("#description").html("");
		$("#icon").attr('src', "");
		getCityWeatherInfo(city);
		$.mobile.changePage("#homePage");

	});

	//popup dialog when attempting to delete recent searches
	$(document).on('click', '#clear', function () {
		var recent = $('#recent');
		var popupClear = $("#popupDialog");
		popupClear.popup("open");

		//confirming deleting of recent searches
		$('#delete').click(function () {

			recent.html("");

			recent.listview('refresh');
			localStorage.removeItem("searchedCity");


		});

	})

});