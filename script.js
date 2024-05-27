function getGeocode(){
    const city_name = document.getElementById('city').value;
    const state_name = document.getElementById('state').value;
    if (!city_name) {
        alert('You are missing a city');
        return;
    }

    if(!state_name) {
        alert('You are missing a state');
        return;
    }

    const geocodeUrl = `https://geocode.maps.co/search?city=${city_name}&state=${state_name}&api_key=664b7f0e168b8295284849yinb13482`;
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            getForecast(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching location. Please try again.');
        });
}

function getForecast(data){
    console.log(data);
    const lon = data[0].lon;
    const lat = data[0].lat;
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=af49b45544a4460385c173117242005&q=${lat},${lon}&days=7`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayHourlyForecast(data);
            displayWeeklyForecast(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching forecast. Please try again.');
        });
}

function displayWeather(data) {
    console.log(data);
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    
    const cityName = data.location.name;
    const temperature = data.current.temp_f;
    const description = data.current.condition.text;
    const iconUrl = data.current.condition.icon;

    const temperatureHTML = `
        <p>${temperature}°F</p>
    `;

    const weatherHtml = `
        <p>${cityName}</p>
        <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = `https:${iconUrl}`;
    weatherIcon.alt = description;

    showImage();
}

function displayHourlyForecast(data) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const hourlyLabel = document.getElementById('hourly-label')
    hourlyLabel.innerHTML = `<p>Hourly Forecast</p>`

    const next24Hours = data.forecast.forecastday[0].hour; 

    next24Hours.forEach(item => {
        const hour =  item.time.substring(10, 13);
        const temperature = item.temp_f;
        const iconUrl = item.condition.icon;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="https:${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function displayWeeklyForecast(data){
    const weeklyForecastDiv = document.getElementById('weekly-forecast');
    const weeklyLabel = document.getElementById('weekly-label');
    weeklyLabel.innerHTML = `<p>Weekly Forecast</p>`;
    const nextFiveDays = data.forecast.forecastday;

    weeklyForecastDiv.innerHTML = '';

    for (i=0; i<5; i++) {
        const date = nextFiveDays[i+2].date;
        const temperature = nextFiveDays[i+1].day.avgtemp_f;
        const iconUrl = nextFiveDays[i+1].day.condition.icon;
        const date_object = new Date(date);
        const daysOfWeek = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
          ];
        const dayOfWeek = daysOfWeek[date_object.getDay()];
        const weeklyItemHtml = `
            <div class="weekly-item">
                <span>${dayOfWeek}</span>
                <img src="https:${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;
        weeklyForecastDiv.innerHTML += weeklyItemHtml;
    }

}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}