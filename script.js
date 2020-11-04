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
            temp = Math.floor((temp - 273.15) * (9 / 5) + 32)
            var humidity = response.list[i].main.humidity
            var condition = response.list[i].weather[0].description

            var weatherCard = $(`#day${i + 1}`)
            weatherCard.html('')
            var weatherInfo = $(`<div class= 'card-body'>Temp: ${temp}&#8457<br>Humidity: ${humidity}%<br>${condition}</div>`)
            $(weatherCard).append(weatherInfo)

        }

    })
})




