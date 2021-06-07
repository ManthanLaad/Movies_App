// MODULES
require("./db/mongoose");

// PACKAGES
const axios = require("axios");
const config = require("config");
const path = require("path");
const express = require("express");
const ejs = require("ejs");
const getGenreNames = require("./utils/genres");
const Movie = require("./models/populateDB");

//  CONFIGS
const app = express();
const port = process.env.PORT || 3000;
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${config.get(
  "API_Key"
)}`;
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "ejs");
app.use(express.static(publicPath));
app.use(express.json());

// ENDPOINTS

app.post("/addMovies", async (req, res) => {
  const page = req.query.page;
  const movies = await axios.get(API_URL + `&page=${page}`);
  movies.data.results.forEach((movie) => {
    const genre = getGenreNames(movie.genre_ids);
    const temp = new Movie({
      title: movie.original_title,
      overview: movie.overview,
      path: movie.poster_path,
      language: movie.original_language,
      date: movie.release_date,
      adult: movie.adult,
      rating: movie.vote_average,
      genre: genre,
    });
    temp
      .save()
      .then((response) => console.log("Success"))
      .catch((err) => console.log("Failed"));
  });
  res.send("Complete");
});

app.get("/", (req, res) => {
  const page = req.query.page || 1;
  Movie.find({})
    .skip(15 * (page - 1))
    .limit(15)
    .then((response) => {
      res.render("index", { movies: response });
    })
    .catch((err) => res.send("Error"));
});

app.get("/movies", (req, res) => {
  const page = req.query.page || 1;
  Movie.find({})
    .skip(15 * (page - 1))
    .limit(15)
    .then((response) => {
      res.send({ movies: response });
    })
    .catch((err) => res.send("Error"));
});

app.get("/sort", (req, res) => {
  const field = req.query.field;
  const order = req.query.order;
  const page = req.query.page || 1;
  Movie.find({})
    .sort({ [field]: [order] })
    .skip(15 * (page - 1))
    .limit(15)
    .then((response) => res.send({ movies: response }))
    .catch((err) => res.send("Error"));
});

app.get("/filter", (req, res) => {
  const field = req.query.field;
  const value = req.query.value;
  const page = req.query.page || 1;
  if (field === "genre") {
    Movie.find({
      genre: { $elemMatch: { $in: [value] } },
    })
      .skip(15 * (page - 1))
      .limit(15)
      .then((response) => res.send({ movies: response }))
      .catch((err) => res.send(err));
  } else if (field === "adult") {
    Movie.find({ [field]: [value == "true"] })
      .skip(15 * (page - 1))
      .limit(15)
      .then((response) => res.send({ movies: response }))
      .catch((err) => res.send(err));
  } else {
    Movie.find({ [field]: [value] })
      .skip(15 * (page - 1))
      .limit(15)
      .then((response) => res.send({ movies: response }))
      .catch((err) => res.send(err));
  }
});
app.listen(port, () => console.log(`App is running on port ${port}`));
