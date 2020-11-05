$('#search-form').on('submit', function (event) {
    event.preventDefault()

    var userInput = $('#search-box').val()
    console.log(userInput)

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&cnt=5&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {

        console.log(response.list)
        //    var date = response.list[0].dt_txt

        for (var i = 0; i < 5; i++) {

            var temp = response.list[i].main.temp
            temp = Math.floor(((temp - 273.15) * 1.8) + 32)
            var humidity = response.list[i].main.humidity
            var condition = response.list[i].weather[0].main

            switch (condition) {
                case 'Clouds':
                    condition = '<i class="fas fa-cloud-sun"></i>';
                    break;
                case 'Clear':
                    condition = '<i class="fas fa-sun"></i>';
                    break;
                case 'Rain':
                    condition = '<i class="fas fa-cloud-rain"></i>';
                    break;
                    case 'Snow':
                        condition = '<i class="fas fa-snowflake"></i>';
                        break;
            }

            var weatherCard = $(`#day${i + 1}`)
            weatherCard.html('')
            var weatherInfo = $(`<div class= 'card-body'>Temp: ${temp}&#8457<br>Humidity: ${humidity}%<br>${condition}</div>`)
            $(weatherCard).append(weatherInfo)

        }

    })

    var dayURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: dayURL,
        method: 'GET'
    }).then(function (response) {

        var temp = response.main.temp
        temp = Math.floor(((temp - 273.15) * 1.8) + 32)
        var humidity = response.main.humidity
        var windSpeed = response.wind.speed

        $('#temperature').html(`Temperature: ${temp} &#8457`)
        $('#humidity').html(`Humidity: ${humidity}%`)
        $('#windSpeed').html(`Wind Speed: ${windSpeed}`)

        var longitude = response.coord.lon
        var latitude = response.coord.lat

        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=52f80a8e6eee61dc210e113236e5b264`,
            method: 'GET'
        }).then(function (response) {
            $('#uvIndex').html(`UV Index: ${response.value}`)
        })

    })
})




