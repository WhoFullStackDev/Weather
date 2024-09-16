require("dotenv").config();
const express = require("express");
const path = require("path");

const weatherRoute = require("./routes/weatherRoute");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.use("/", weatherRoute);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
