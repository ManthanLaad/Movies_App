const mongoose = require("mongoose");

const Movies = mongoose.model("movies", {
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  adult: {
    type: Boolean,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = Movies;
