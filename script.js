$('#search-form').on('submit', function (event) {
    event.preventDefault()

    var userInput = $('#search-box').val()
    console.log(userInput)

    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&cnt=5&appid=52f80a8e6eee61dc210e113236e5b264`

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {


       var date = response.list[0].dt_txt
       var temp = response.list[0].main.temp
       var humidity = response.list[0].main.humidity
       var condition = response.list[0].weather[0].description

       var weatherCard = $('#day1')
       var weatherInfo = $(`<div class= 'card-body'>${date}<br>Temp: ${temp}<br>Humidity: ${humidity}<br>${condition}</div>`)
       $(weatherCard).append(weatherInfo)

        // Returns date of the first day in the array
        console.log(response.list[0])

        // Temperature
        console.log('Temperature:' + response.list[0].main.temp)

        // Humidity
        console.log('Humidity:' + response.list[0].main.humidity + '%')

        // Weather condition (sunny/cloudy/rain)
        console.log('Weather Condition:' + response.list[0].weather[0].description)

    })
})




