const apiKey = '33ea370c10b643eed038712704d4f87d'; // Replace with your OpenWeatherMap API key

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    getWeatherData(city);
    saveSearchHistory(city);
    displaySearchHistory();
});

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(function(response) {
            return response.json();
        })
        .then(function(currentWeatherData) {
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(forecastData) {
                    displayWeather(currentWeatherData, forecastData);
                });
        })
        .catch(function(error) {
            alert('City not found!');
        });
}

function displayWeather(currentWeather, forecast) {
    document.getElementById('city-name').textContent = currentWeather.name + ' (' + new Date().toLocaleDateString() + ')';
    document.getElementById('current-weather').innerHTML = `
        Temp: ${currentWeather.main.temp}°F<br>
        Wind: ${currentWeather.wind.speed} MPH<br>
        Humidity: ${currentWeather.main.humidity}%
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
            getWeatherData(city);
        });
        searchHistoryContainer.appendChild(cityElement);
    });
}

// Initial display of search history
displaySearchHistory();