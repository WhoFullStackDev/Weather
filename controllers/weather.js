const getWeather = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      res.status(400).json({ message: "not retrieve value" });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getWeather };
