const KEY_API = `ffeb03df3c566546ba0b7ea9b4239463`;
const BASE_URL = `https://api.themoviedb.org/3`;
const IMAGE_PATH = `https://image.tmdb.org/t/p/w1280`;
const trailer_path = `https://www.youtube.com/watch?v=`;
const API_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${KEY_API}`;
// api details
const form = document.querySelector('form');
const input = document.querySelector('.search-form input');
const searchBtn = document.querySelector('.search-form button');
const mainGrid = document.querySelector('.movies-grid');

showMovies(API_URL);
function showMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.results);
      displayMovies(data.results);
    });
}

function displayMovies(movies) {
  mainGrid.innerHTML = '';
  movies.forEach(movie => {
    const { name, poster_path, vote_average, first_air_date, genre_ids } =
      movie;
    const movieElement = document.createElement('div');
    movieElement.classList.add('card');
    movieElement.innerHTML = `
    
        <div class="img">
            <img src="${IMAGE_PATH + poster_path}">
        </div>
        <div class="info">
            <h2 class="movie-name">${name}</h2>
                <div class="single-info">
                    <span>${genre_ids}</span> <span>&#124;</span> <span>${first_air_date}</span><span>Rating: ${vote_average}</span>
                </div>
        </div>
      
    `;
    mainGrid.appendChild(movieElement);
  });
}

async function searchMovie(searchWord) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${KEY_API}&query=${searchWord}
    `
  );
  const respData = await resp.json();
  return respData.results;
}

searchBtn.addEventListener('click', searchedMovies);
async function searchedMovies() {
  const data = await searchMovie(input.value);
  console.log(data);

  mainGrid.innerHTML = data
    .map(e => {
      return `
    <div class="card" data-id="${e.id.value}">
        <div class="img">
            <img src="${IMAGE_PATH + e.poster_path}">
        </div>
        <div class="info">
            <h2 class="movie-name">${e.title}</h2>
                <div class="single-info">
                    <span>${e.genre_ids}</span> <span>&#124;</span> <span>${
        e.release_date
      }</span><span>Rating: ${e.vote_average}</span>
                </div>
        </div>
    </div>
      `;
    })
    .join('');
}
