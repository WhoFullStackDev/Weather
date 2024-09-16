const { getWeather } = require("../controllers/weather");

const route = require("express").Router();

route.get("/weather", getWeather);

module.exports = route;
