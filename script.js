const latitude = document.querySelector('.lat');
const longitude = document.querySelector('.long');

const gmap = document.querySelector('.gmap');
const locationName = document.querySelector('.loc');
const windSpeed = document.querySelector('.windSpeed');
const humidity = document.querySelector('.humidity');
const timeZone = document.querySelector('.timeZone');
const pressure = document.querySelector('.Pressure');
const windDirection = document.querySelector('.windDirc');
const uvIndex = document.querySelector('.uvIdx');
const feelsLike = document.querySelector('.Temp');
const fetchBtn = document.getElementById('fetchBtn');

const apiKey = "1e43862694e6e758ff1ddc5385dd612f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

async function getLocation(position) {
    await checkWeather(position.coords.latitude, position.coords.longitude);
    document.getElementById('landing-page').style.display = 'none';
};
function failed() {
    alert('Failed to fetch location !  Please check have you given location access.');
    document.getElementById('data-page').style.display = 'none';
};

fetchBtn.addEventListener('click', async () => {
    navigator.geolocation.getCurrentPosition(getLocation, failed);
    document.getElementById('data-page').style.display = 'block';
});

function getWindDirection(degrees) {
    // Convert degrees to a direction
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const index = Math.round((degrees % 360) / 45);
    return directions[index % 8];
}

function hPaToAtmospheres(hPa) {
    const atm = hPa / 1013.25;
    return atm;
}

async function checkWeather(lat, long) {
    const response = await fetch(apiUrl + `&lat=${lat}&lon=${long}&appid=${apiKey}`)

    let data = await response.json();
    console.log(data);

    gmap.src = `https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed`;

    let offsetSeconds = data.timezone;
    let strhours = Math.floor(offsetSeconds / 3600); // 1 Hour = 3600 seconds
    let strminutes = Math.floor((offsetSeconds % 3600) / 60); // 1 minute = 60 seconds

    let formattedTime = `${strhours.toString().padStart(2, '0')}:${strminutes.toString().padStart(2, '0')}`;

    let windDegrees = data.wind.deg; // Change this to your wind direction in degrees
    let windDirec = getWindDirection(windDegrees);

    let pressureInhPa = data.main.pressure; // Change this to your pressure in hectopascals
    let pressureInAtm = hPaToAtmospheres(pressureInhPa);

    latitude.innerHTML = `Lat : ${lat}`;

    longitude.innerHTML = `Long : ${long}`;

    locationName.innerHTML = `Location : ${data.name}`;

    windSpeed.innerHTML = `Wind Speed : ${data.wind.speed} Kmph`;

    humidity.innerHTML = `Humidity : ${data.main.humidity}%`;

    timeZone.innerHTML = `Time Zone : GMT +${formattedTime}`;

    pressure.innerHTML = `Pressure : ${Math.round(pressureInAtm)} atm`;

    windDirection.innerHTML = `Wind Direction : ${windDirec}`;

    uvIndex.innerHTML = `UV Index : ${data.main.temp}`;

    feelsLike.innerHTML = `Feels like : ${data.main.feels_like}°`;
}