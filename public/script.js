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

  try {
    const response = await fetch(geoUrl, { method: "GET" });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const data = await response.json();
    const locationPoint = data.results[0]?.geometry;
    if (locationPoint) {
      const lat = locationPoint.lat;
      const lng = locationPoint.lng;
      getWeather(lat, lng);
    } else {
      console.error("Location data not found");
    }
    form.reset();
  } catch (error) {
    console.error("Error fetching geolocation:", error);
  }
});

const getLocation = async () => {
  try {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("Mobile Location:", lat, lng);
        await getWeather(lat, lng);
      },
      (error) => {
        // If permission denied or error occurred, log error message
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Location permission denied");
        } else {
          console.error("Error retrieving location:", error.message);
        }
        alert("Please enable location services and try again.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Increased timeout
        maximumAge: 0,
      }
    );
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
      throw new Error(response.statusText); // More specific error
    }
    const result = await response.json();
    tempNum.innerHTML = Math.round(result.main.temp - 273);
    place.innerHTML = result.name;
    humidityNum.innerHTML = result.main.humidity;
    windNum.innerHTML = result.wind.speed;

    // Set weather icon based on condition
    switch (result.weather[0].main) {
      case "Clouds":
        weatherIcon.src = "images/clouds.png";
        break;
      case "Rain":
        weatherIcon.src = "images/rain.png";
        break;
      case "Haze":
        weatherIcon.src = "images/mist.png";
        break;
      case "Snow":
        weatherIcon.src = "images/snow.png";
        break;
      case "Clear":
        weatherIcon.src = "images/clear.png";
        break;
      default:
        weatherIcon.src = "images/default.png";
    }

    console.log(result);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
  }
};

// Trigger location request at load
getLocation();
