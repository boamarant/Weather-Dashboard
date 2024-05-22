const apiKey = '33ea370c10b643eed038712704d4f87d'; // Uses my api key as a variable

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value; 
    getWeatherData(city, function(isValid) { 
        if (isValid) { //Saves search history if a valid city is entered
            saveSearchHistory(city);
            displaySearchHistory();
        }
    });
});

function getWeatherData(city, callback) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`) //Calls the API to find current conditions
        .then(function(response) {
            if (!response.ok) {
                throw new Error('City not found'); //Checks for errors to ensure invalid searches are not included in search history
            }
            return response.json();
        })
        .then(function(currentWeatherData) {
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`) //Calls the API to find 5 day forecast
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('City not found');
                    }
                    return response.json();
                })
                .then(function(forecastData) {
                    displayWeather(currentWeatherData, forecastData);
                    callback(true); // City is valid
                });
        })
        .catch(function(error) {
            alert(error.message);
            removeInvalid(city);
            callback(false); // City is invalid
        });
}

function displayWeather(currentWeather, forecast) {
    document.getElementById('city-name').textContent = currentWeather.name + ' (' + new Date().toLocaleDateString() + ')';
    document.getElementById('current-weather').innerHTML = `
        <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        <p>Temp: ${currentWeather.main.temp}°F</p>
        <p>Wind: ${currentWeather.wind.speed} MPH</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
    `;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecast.list.length; i += 8) {
        const forecastItem = forecast.list[i];
        const forecastDate = new Date(forecastItem.dt * 1000).toLocaleDateString();

        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-item';
        forecastElement.innerHTML = `
            <p>${forecastDate}</p>
            <img src="http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png" alt="Weather Icon">
            <p>Temp: ${forecastItem.main.temp}°F</p>
            <p>Wind: ${forecastItem.wind.speed} MPH</p>
            <p>Humidity: ${forecastItem.main.humidity}%</p>
        `;
        forecastContainer.appendChild(forecastElement);
    }
}

function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = '';

    searchHistory.forEach(function(city) {
        const cityElement = document.createElement('button');
        cityElement.textContent = city;
        cityElement.className = 'history-item';
        cityElement.addEventListener('click', function() {
            getWeatherData(city, function() {}); // Callback does nothing here
        });
        searchHistoryContainer.appendChild(cityElement);
    });
}

function removeInvalid(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const index = searchHistory.indexOf(city);
    if (index > -1) {
        searchHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

// Initial display of search history
displaySearchHistory();