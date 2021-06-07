const firstSelect = document.querySelector("#select-field");
const main = document.querySelector("#main");
const secondSelect = document.querySelector(".select-value");
const title = document.querySelector("#title");
const message = document.querySelector("#message");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const pageNo = document.querySelector(".page");

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];
const adult = [true, false];
const lang = ["en", "fr", "es", "ko", "zh", "ja"];
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

var page = 1;
var currURL = `/movies?`;
var newPage = true;

right.addEventListener("click", (e) => {
  page = page + 1;
  left.classList.remove("hidden");
  pagenation();
});

left.addEventListener("click", (e) => {
  page = page - 1;
  right.classList.remove("hidden");
  pagenation();
});

firstSelect.addEventListener("change", (event) => {
  page = 1;
  pageNo.innerText = page;
  secondSelect.classList.add("hidden");
  secondSelect.innerHTML = "";
  const field = firstSelect.value;
  if (field === "title" || field === "rating") {
    sortMovies(field);
  } else {
    filterMovies(field);
  }
});

secondSelect.addEventListener("change", (event) => {
  page = 1;
  pageNo.innerText = page;
  main.innerHTML = "";
  const value = secondSelect.value;
  const field = firstSelect.value;
  currURL = `/filter?value=${value}&field=${field}&`;
  fetch(currURL + `page=${page}`).then((res) => {
    res.json().then((data) => {
      newPage = data.movies.length < 14 ? false : true;
      check();
      showMovies(data.movies);
    });
  });
});

function sortMovies(field) {
  main.innerHTML = "";
  order = 1;
  if (field === "rating") {
    order = -1;
  }
  currURL = `/sort?field=${field}&order=${order}&`;
  fetch(currURL + `page=${page}`).then((res) => {
    res.json().then((data) => {
      newPage = data.movies.length < 14 ? false : true;

      console.log(newPage, page);
      check();
      showMovies(data.movies);
    });
  });
}

function filterMovies(field) {
  var values = adult;
  if (field === "genre") {
    values = genres;
  } else if (field === "language") {
    values = lang;
  }
  values.forEach((value) => {
    const option = document.createElement("option");
    option.setAttribute("value", `${value}`);
    option.innerText = `${value}`.toUpperCase();
    secondSelect.appendChild(option);
  });
  secondSelect.classList.remove("hidden");
}

function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("movie");

    const img = document.createElement("img");
    img.setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.path}`);
    wrapper.appendChild(img);

    const div1 = document.createElement("div");
    div1.classList.add("movie-info");

    const h3 = document.createElement("h3");
    h3.innerText = movie.title;
    div1.appendChild(h3);

    const span = document.createElement("span");
    span.innerText = movie.rating;
    if (movie.rating > 7.5) {
      span.classList.add("green");
    } else if (movie.rating > 5) {
      span.classList.add("yellow");
    } else if (movie.rating > 2.5) {
      span.classList.add("orange");
    } else {
      span.classList.add("red");
    }
    div1.appendChild(span);

    const span2 = document.createElement("span");
    span2.innerText = movie.language.toUpperCase();
    div1.appendChild(span2);

    const span3 = document.createElement("span");
    const adult = movie.adult ? "A" : "UA";
    span3.innerText = adult.toUpperCase();
    div1.appendChild(span3);

    wrapper.appendChild(div1);

    const div2 = document.createElement("div");
    div2.classList.add("overview");

    const h = document.createElement("h3");
    h.innerText = "Overview";
    div2.appendChild(h);

    div2.innerText = movie.overview;
    wrapper.appendChild(div2);
    main.appendChild(wrapper);
  });
}

function pagenation() {
  fetch(currURL + `page=${page}`).then((res) => {
    console.log(res);
    res.json().then((data) => {
      console.log(data);
      newPage = data.movies.length < 14 ? false : true;
      check();
      pageNo.innerText = page;
      showMovies(data.movies);
    });
  });
}

function check() {
  console.log("Inside check");
  if (page == 1) {
    left.classList.add("hidden");
    if (newPage) {
      right.classList.remove("hidden");
    } else {
      right.classList.add("hidden");
    }
  } else {
    if (newPage) {
      left.classList.remove("hidden");
    } else {
      right.classList.add("hidden");
      left.classList.remove("hidden");
    }
  }
}
