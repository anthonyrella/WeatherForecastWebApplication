$(document).one('pagecreate', function () {
	var search = $('#search');
	var recent = $('#recent');
	var cityList = $('#cityNamesList');
	var searchVal;
	var day=['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
	updateWeatherCurrentLocation();
	search.parent("div").hide();
	var savedSearches = new Array;
	loadSavedCities();
	getCityListNames();

	//will read names from drive
	function getCityListNames()
	{
		if(cityList.is(':empty')){
		$.getJSON('../Final Project/resources/data/cities.JSON')
			.done(function(data){
				$.each(data, function(key, city){
					$('<li></li>').attr('id', 'city' + key)
								  .appendTo('#cityNamesList');
					$('<a></a>').attr('href', '#homePage')
								.attr('id', 'citySearch')
							    .append(city.name)
							    .appendTo('#city' + key);
				})
			})
			.fail(function(e){
				console.log(e);
			})
		}
	}

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
		$.getJSON('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
			.done(function (data) {
				var temp = data.main.temp + " &#8451;";
				var locationName = data.name;
				var weather = data.weather[0].description;
				var weatherIcon = data.weather[0].icon;
				$("#temp").append(temp);
				$("#city").append(locationName);
				$("#description").append(weather);
				$("#icon").attr('src', 'http://openweathermap.org/img/w/'+ weatherIcon + '.png')
				

				
			})
			.fail(function (e) {
				console.log(e);
			})
	}

	//ajax call to weather api by city name and displays weather information to homepage
	function getCityWeatherInfo(cityName) {
		$.getJSON('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
			.done(function (data) {
				var temp = data.main.temp + " &#8451;";
				var locationName = data.name;
			
				var weather = data.weather[0].description;
			var weatherIcon = data.weather[0].icon;
				$("#temp").append(temp);
				$("#city").append(locationName);
				$("#description").append(weather);
				$("#icon").attr('src', 'https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/w/'+ weatherIcon + '.png')
				
			
			})
			.fail(function (e) {
				console.log(e);
			})
	}

	//ajax call to weather api for 5 day forecast and displays weather information to homepage
	function getForecastWeather(lat, long) {
		$.getJSON('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
			.done(function (data) {
				var locationName = "Forecast location: " + data.city.name;
			
			
				create24HourChart(data);
				create5DayChart(data);
			})
			.fail(function (e) {
				console.log(e);
			})
	}

	//ajax call to weather api for forecast on specific city entered
	function getCityForecastWeather(cityName) {
		$.getJSON('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=9ea3d628a6d3e398f9c7e992b0ecee16&units=metric')
			.done(function (data) {
			
				var locationName = "Forecast location: " + data.city.name;
			
			create24HourChart(data);
			create5DayChart(data);
			})
			.fail(function (e) {
				console.log(e);
			})
	}

	//create chart for 5 day forecast
	function create5DayChart(forecastData) {
		//data for date and temperature
		var chart_date = new Array;
		var chart_temp = new Array;

		$.each(forecastData.list, function(key, value){
			
			var todate = new Date(value.dt_txt);
			
			var tempfloat = parseFloat(value.main.temp);
			chart_date.push(todate);
			chart_temp.push(tempfloat);
		});

		//refines above data into a more readable format
		var chart_day5d = new Array;
		var chart_temp5d_min = new Array();
		var chart_temp5d_max = new Array();
		var chart_temp5d_avg = new Array();
		var min= max= avg=chart_temp[0]; 
		var curday=chart_date[0].getDay();

		//because min and max temperatures are the same, the daytime high and low are taken and then averaged
		for(var i = 0; i < chart_temp.length; i++){
			if(curday != chart_date[i].getDay()){
				chart_day5d.push(day[curday]);
				chart_temp5d_min.push(min);
				chart_temp5d_max.push(max);
				chart_temp5d_avg.push(avg);
				curday=chart_date[i].getDay();
				min= max= avg=chart_temp[i]; 
			}
			if(chart_temp[i] > max){
				max=chart_temp[i];
				avg=(min+max)/2;
			}
			if(chart_temp[i] < min){
				min=chart_temp[i];
				avg=(min+max)/2;
			}
			
		}
		chart_day5d.push(day[curday]);
		chart_temp5d_min.push(min);
		chart_temp5d_max.push(max);
		chart_temp5d_avg.push(avg);

		//remove old canvas and replace it with new one of the same id
		$('#FiveDay').remove();
		$('<canvas></canvas>').attr('id', "FiveDay").appendTo('#graphs');

		//graph creation -- with help from examples from their website
		var cvs = document.getElementById("FiveDay");
		var ctx = cvs.getContext('2d');
		var chartData = {
            type: 'line',
            data: {
                labels: chart_day5d,
                datasets: [{
                    label: "Low",
                    fill: false,
                    backgroundColor: "rgba(0,0,225,0.5)",
                    borderColor: "rgba(0,0,255,1)",
                    data: chart_temp5d_min,
                },
               	{
                    label: "High",
                    fill: false,
                    backgroundColor: "rgba(220,0,0,0.5)",
                    borderColor: "rgba(255,0,0,1)",
                    data: chart_temp5d_max,
                },
                {
                    label: "Avg",
                    fill: false,
                    backgroundColor: "rgba(0,225,0,0.5)",
                    borderColor: "rgba(0,255,0,1)",
                    data: chart_temp5d_avg,
                }]
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Forecast'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Hours'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Degrees C'
                        }
                    }]
                }
            }
        };	
        //create new graph
		new Chart(ctx,chartData);
	}

	//create forecast for 24 hours
	function create24HourChart(forecastData) {
		//raw data
		var chart_date = new Array;
		var chart_temp = new Array;
		$.each(forecastData.list, function(key, value){
			var todate = new Date(value.dt_txt);
			var tempfloat = parseFloat(value.main.temp);
			chart_date.push(todate);
			chart_temp.push(tempfloat);
		});
		//refining data
		var chart_day24h = new Array;
		var chart_temp24h = new Array;
		//because the intervals are in 3s, we take the first 8 which add up to 24 hours
		for(var i = 0; i < 8; i++){
			var datetext=day[chart_date[i].getDay()] + ', ' + chart_date[i].getHours() + '00';
			chart_temp24h.push(chart_temp[i]);
			chart_day24h.push(datetext);
		}
		//recreating canvas
		$('#TwentyFourHour').remove();
		$('<canvas></canvas>').attr('id', "TwentyFourHour").appendTo('#graphs');
		//chart creation
		var cvs = document.getElementById("TwentyFourHour");
		var ctx = cvs.getContext('2d');
		var chartData = {
	        type: 'line',
	        data: {
	            labels: chart_day24h,
	            datasets: [{
	                label: "Low",
	                fill: false,
	                backgroundColor: "rgba(0,0,0,0.5)",
	                borderColor: "rgba(0,0,0,1)",
	                data: chart_temp24h,
	            }]
	        },
	        options: {
	            responsive: true,
	            title:{
	                display:true,
	                text:'Forecast'
	            },
	            tooltips: {
	                mode: 'index',
	                intersect: false,
	            },
	            hover: {
	                mode: 'nearest',
	                intersect: true
	            },
	            scales: {
	                xAxes: [{
	                    display: true,
	                    scaleLabel: {
	                        display: true,
	                        labelString: 'Hours'
	                    }
	                }],
	                yAxes: [{
	                    display: true,
	                    scaleLabel: {
	                        display: true,
	                        labelString: 'Degrees C'
	                    }
	                }]
	            }
	        }
	    };	
		new Chart(ctx,chartData);
	}
	function showError() {
		alert("Your Location is required for this Application to run! Please re-enable it and refresh the page. Thank you.");
	}

	//will refresh city if city has been entered in seach. Else will refresh current location	
	$(document).on('tap', '#refresh', function () {
		$("#temp").html("");
		$("#city").html("");
		$("#description").html("");
		if (searchVal) {
			getCityWeatherInfo(searchVal);
			getCityForecastWeather(searchVal);
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
			getCityForecastWeather(searchVal);
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
		getCityForecastWeather(city);
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