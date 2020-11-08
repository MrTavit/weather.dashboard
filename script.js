// Stores the value for how many cities have been searched.
var cityCounter = 1
init()
$('#search-form').on('submit', function (event) {
    event.preventDefault()
    var userInput = $('#search-box').val()
    getWeather(userInput)
    addCity(userInput)
    cityCounter++
    createLocalStorage(userInput)
    $('#search-box').val('')
})


// When any id is clicked that starts with the text 'userCity' run this function.
$('[id^=userCity]').on('click', function (event) {
    event.preventDefault()
    var city = $(this)[0].innerText
    getWeather(city)
    createLocalStorage(city)
})

// Adds the most recently searched city to the bottom of the list. When the last text field is reached, reset to the first and overwrite from there.
function addCity(userInput) {
    if (cityCounter > 10) {
        cityCounter = 1
    }
    $(`#userCity${cityCounter}`).text(`${userInput}`)
    $(`#userCity${cityCounter}`).toggle()

}


// Initiliazes
function init() {
    if (localStorage.getItem('Last City')) {
        getWeather(localStorage.getItem('Last City'))
    }
}

// Sets the local storage for the city that is passed in
function createLocalStorage(city) {
    localStorage.setItem('Last City', city)
}

// Calls the OpenWeatherMap 5 Day/3 Hour Forecast API to generate the output for the weather 
function getWeather(userInput) {

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response.list)

        // Counter controls where the information will be stored
        var counter = 0

        //  Jumps every 8 positions to get 1 weather forecast per day.
        for (var i = 0; i < response.list.length; i += 8) {

            var temp = response.list[i].main.temp
            // Convert temp from Kelvin to Fahrenheit 
            temp = Math.floor(((temp - 273.15) * 1.8) + 32)
            var humidity = response.list[i].main.humidity
            var condition = response.list[i].weather[0].main

            // Grab the date information from the response, then convert it to display the date in MM/DD/YYYY format.
            var cardDate = new Date(response.list[i].dt_txt)
            cardDate = cardDate.toLocaleDateString()

            // Call the checkConditions function to determine which icon to display on the card
            condition = checkConditions(condition)

            // var weatherCard = $(`#day${counter + 1}`)
            // Clear the card before adding new information
            // weatherCard.html('')
            $(`#cardDate${counter + 1}`).html(cardDate)
            $(`#condition${counter + 1}`).html(condition)
            $(`#temp${counter + 1}`).html(`Temp: ${temp}&#8457`)
            $(`#humid${counter + 1}`).html(`Humidity: ${humidity}%`)

            // <div id="cardDate1"></div>
            //                 <div id="condition1"></div>
            //                 <div id="temp1"></div>
            //                 <div id="humid1"></div>


            // var weatherInfo = $(`<div class= 'card-body'>${cardDate}<br>${condition}<br>Temp: ${temp}&#8457<br>Humidity: ${humidity}%</div>`)
            // $(weatherCard).append(weatherInfo)

            // Counter is incremented after data is stored
            counter++
        }

    })
    // Call for the OpenWeatherMap Current Weather API
    var dayURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: dayURL,
        method: 'GET'
    }).then(function (response) {
        // console.log(response)
        var temp = response.main.temp
        temp = Math.floor(((temp - 273.15) * 1.8) + 32)
        var humidity = response.main.humidity
        var windSpeed = response.wind.speed
        var city = response.name
        var condition = response.weather[0].main
        // console.log(condition)
        condition = checkConditions(condition)
        var currentDate = new Date()
        currentDate = currentDate.toLocaleDateString()



        $('#city').html(`${city}`)
        $('#currentDate').html(`(${currentDate})`)
        $('#currentCond').html(`${condition}`)
        $('#temperature').html(`${temp}`)
        $('#humidity').html(`${humidity}`)
        $('#windSpeed').html(`${windSpeed}`)

        var longitude = response.coord.lon
        var latitude = response.coord.lat

        $.ajax({
            // Call for the OpenWeatherMap UV Index API.
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=52f80a8e6eee61dc210e113236e5b264`,
            method: 'GET'
        }).then(function (response) {
            var uvIndex = $('#uvIndex')
            uvIndex.html(`${response.value}`)
            // Changes the color of the text field based on the value
            switch (true) {
                case (response.value < 3 && response.value >= 0):
                    uvIndex.css('background-color', 'rgb(99, 204, 67)')
                    break
                case (response.value < 6 && response.value >= 3):
                    uvIndex.css('background-color', 'yellow')
                    break
                case (response.value < 8 && response.value >= 6):
                    uvIndex.css('background-color', 'orange')
                    break
                case (response.value >= 8):
                    uvIndex.css('background-color', 'red')
                    break
            }
        })

    })
}

function checkConditions(condition) {
    switch (condition) {
        case 'Clouds':
            condition = '<i class="fas fa-cloud-sun" style="color: lightgrey"></i>'
            break
        case 'Clear':
            condition = '<i class="fas fa-sun" style="color:orange"></i>'
            break
        case 'Rain':
            condition = '<i class="fas fa-cloud-rain" style="color:grey"></i>'
            break
        case 'Snow':
            condition = '<i class="fas fa-snowflake"></i>'
            break
        case 'Haze':
        case 'Mist':
        case 'Fog':
            condition = '<i class="fas fa-smog" style="color:grey"></i>'
            break
    }
    return condition
}

