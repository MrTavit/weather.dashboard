$('#search-form').on('submit', function (event) {
    event.preventDefault()

    var userInput = $('#search-box').val()
    console.log(userInput)

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {

        console.log(response.list)
        //    var date = response.list[0].dt_txt


        // Counter controls where the information will be stored
        var counter = 0

        // Starts at the 4th result to display the noon forecast, jumps every 8 positions to get the noon forecast for each day.
        for (var i = 4; i < response.list.length; i+= 8) {

                var temp = response.list[i].main.temp
                temp = Math.floor(((temp - 273.15) * 1.8) + 32)
                var humidity = response.list[i].main.humidity
                var condition = response.list[i].weather[0].main
                var cardDate = new Date(response.list[i].dt_txt)
                cardDate = cardDate.toLocaleDateString()
                // cardDate = 

                condition = checkConditions(condition)
    
                var weatherCard = $(`#day${counter + 1}`)
                // Clear the card before adding new information
                weatherCard.html('')
                var weatherInfo = $(`<div class= 'card-body'>${cardDate}<br>Temp: ${temp}&#8457<br>Humidity: ${humidity}%<br>${condition}</div>`)
                $(weatherCard).append(weatherInfo)
            
            // Counter is incremented after data is stored
            counter++
        }

    })

    var dayURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: dayURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        var temp = response.main.temp
        temp = Math.floor(((temp - 273.15) * 1.8) + 32)
        var humidity = response.main.humidity
        var windSpeed = response.wind.speed
        var city = response.name
        var condition = response.weather[0].main
        console.log(condition)
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
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=52f80a8e6eee61dc210e113236e5b264`,
            method: 'GET'
        }).then(function (response) {
            var uvIndex = $('#uvIndex')
            uvIndex.html(` ${response.value}`)

            switch (true) {
                case (response.value < 3 && response.value >= 0):
                    uvIndex.css('background-color', 'green');
                    break;
                case (response.value < 6 && response.value >= 3):
                    uvIndex.css('background-color', 'rgb(231, 231, 45)');
                    break;
                case (response.value < 8 && response.value >= 6):
                    uvIndex.css('background-color', 'orange');
                    break;
                case (response.value >= 8):
                    uvIndex.css('background-color', 'red');
                    break;
            }
        })

    })
})




function checkConditions(condition) {
    switch (condition) {
        case 'Clouds':
            condition = '<i class="fas fa-cloud-sun"></i>'
            break
        case 'Clear':
            condition = '<i class="fas fa-sun"></i>'
            break
        case 'Rain':
            condition = '<i class="fas fa-cloud-rain"></i>'
            break
        case 'Snow':
            condition = '<i class="fas fa-snowflake"></i>'
            break
    }
    return condition
}

