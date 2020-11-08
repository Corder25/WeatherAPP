// store the value of the input
var city = $("#searchTerm").val();
// store api key
var apiKey = "&appid=dfb4f97122c65be68e8bf1ce9e349a5b";

var date = new Date();

$("#searchTerm").keypress(function(event) { 
	// when you press enter the function will execute and will use the EPD to not move or refresh page
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
    });

    $("#searchBtn").on("click", function() {
     $('#weather1').addClass('show');

     // get the value of the input from user
       city = $("#searchTerm").val();
  
      // clears the search bar
         $("#searchTerm").val("");  

          //   setting the url variable to call api
           var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
  // Calling the api
  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){

    console.log(response)
    // logging the api name
    console.log(response.name)
    // this will log the icon of whatever the current conditions are of given city
    console.log(response.weather[0].icon)
    // converting temp to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    console.log(Math.floor(tempF))
     // this is console logging the humidity 
    console.log(response.main.humidity)
     // this  is console logging the wind speed
    console.log(response.wind.speed)
     // getting response for the api
    CurrentWeather(response);
    CurrentForecast(response);
    makeList();

    })
  });
// this makes a list of entered cities and saves them to local storage
  function makeList() {
    var listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
    window.localStorage.setItem('listItem', JSON.stringify(listItem));
  }


  function CurrentWeather (response) {

    // get the temperature and convert to fahrenheit 
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);
    // this keeps the current cities from stacking on the page 
    $('#currentCity').empty();

    // get and set the content with jquery
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    // once entered the name of the city will post as a header 
    var city = $("<h1>").addClass("card-title").text(response.name);
    // the current date will post under the city name
    var cityDate = $("<h1>").addClass("card-title").text(date.toLocaleDateString('en-US'));
     // this is the current weather conditions icon pulled from openweather
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
    // temperature will post under picture of current conditons
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    // humidity will post under temp 
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    // wind speed will post under temp in mph
    var wind = $("<p>").addClass("card-text current-wind").text("Wind-Speed: " + response.wind.speed + "MPH");
    // this is the current weather conditions icon pulled from openweather
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // add called items to page for current city
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
   
  }
      
function CurrentForecast () {
//   calling the current weather
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast/?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    console.log(response);
    $('#forecast').empty();

    // variable to hold response.list
    var results = response.list;
    console.log(results)
    window.localStorage.setItem('results', JSON.stringify(results));

    for (let i = 0; i < results.length; i++) {

      var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      //   this will log the date and time in the console
      console.log(date);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        // get the temperature and convert to fahrenheit 
        var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        var tempFar = Math.floor(temp);

        var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        // this is the actual card
        var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        // this will post date on card
        var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        //  this is going to post temp in card in fahrenheit
        var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempFar + " °F");
         // this is going to post the humidity in the card 
        var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
        // depending on the weather it will post the similar picture of the current weather in the card
        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
        // this is going to post the windspeed at the bottom of the card
        var wind = $("<p>").addClass("card-text Wind-Speed").text("Wind-Speed: " +  results[i].wind.speed + "MPH")
        // appends the date , picture , temp, and humidity to page
        cardBody.append(cityDate, image, temperature, humidity, wind);
        // this will put the card body on the page
        card.append(cardBody);
        // posts the cards on bottom with forcast items in it
        $("#forecast").append(card);

      }
    }
    
  });

}
