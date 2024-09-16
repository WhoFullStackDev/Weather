const form = document.getElementById("top-form");
const search = document.getElementById("search");
const tempNum = document.getElementById("tempNum");
const place = document.getElementById("place");
const humidityNum = document.getElementById("humidityNum");
const windNum = document.getElementById("windNum");
const weatherIcon = document.getElementById("weatherIcon");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const searchValue = formData.get("search");
  const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${searchValue}&key=d0f404b2246a4c3abd78c77712ffaafb`;

  const response = await fetch(geoUrl, { method: "GET" });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const data = await response.json();
  const locationPoint = data.results[0]?.geometry;
  if (locationPoint) {
    lat = locationPoint.lat;
    lng = locationPoint.lng;
    getWeather(lat, lng);
  } else {
    console.error("Location data not found");
  }
  form.reset();
});

const getLocation = async () => {
  try {
    let lat;
    let lng;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          getWeather(lat, lng);
        },
        (error) => {
          console.error(
            "Error occurred while retrieving location:",
            error.message
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  } catch (error) {
    console.error("Failed to fetch location:", error.message);
  }
};

const getWeather = async (lat, lng) => {
  try {
    const response = await fetch(`/weather?lat=${lat}&lng=${lng}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(response.message);
    }
    const result = await response.json();
    tempNum.innerHTML = Math.round(result.main.temp - 273);
    place.innerHTML = result.name;
    humidityNum.innerHTML = result.main.humidity;
    windNum.innerHTML = result.wind.speed;
    if (result.weather[0].main === "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (result.weather[0].main === "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (result.weather[0].main === "Haze") {
      weatherIcon.src = "images/mist.png";
    } else if (result.weather[0].main === "Snow") {
      weatherIcon.src = "images/snow.png";
    } else if (result.weather[0].main === "Clear") {
      weatherIcon.src = "images/clear.png";
    }
    console.log(result);
  } catch (error) {
    throw new Error(error);
  }
};

getLocation();
