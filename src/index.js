// api details
const KEY_API = `ffeb03df3c566546ba0b7ea9b4239463`;
const BASE_URL = `https://api.themoviedb.org/3`;
const IMAGE_PATH = `https://image.tmdb.org/t/p/w1280`;
const trailer_path = `https://www.youtube.com/watch?v=`;
const API_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${KEY_API}`;

// search form
const input = document.querySelector('.search-form input');
const searchBtn = document.querySelector('.search-form button');

// grid
const mainGrid = document.querySelector('.movies-grid');
const modalContainer = document.querySelector('.modal-container');

// pagination
const start = document.createElement('button');
start.classList.add('start-page-btn');
start.classList.add('pagination-btn');
document.getElementById('pagination-container').appendChild(start);

const prev = document.createElement('button');
prev.classList.add('previous-page-btn');
prev.classList.add('pagination-btn');
document.getElementById('pagination-container').appendChild(prev);

let paginationBtnLeft = document.createElement('button');
paginationBtnLeft.classList.add('pagination-btn');
paginationBtnLeft.textContent = '';
document.getElementById('pagination-container').appendChild(paginationBtnLeft);

let paginationBtn = document.createElement('button');
paginationBtn.classList.add('pagination-btn');
paginationBtn.textContent = '';
document.getElementById('pagination-container').appendChild(paginationBtn);

let paginationBtnRight = document.createElement('button');
paginationBtnRight.classList.add('pagination-btn');
paginationBtnRight.textContent = '';
document.getElementById('pagination-container').appendChild(paginationBtnRight);

const next = document.createElement('button');
next.classList.add('next-page-btn');
next.classList.add('pagination-btn');
document.getElementById('pagination-container').appendChild(next);

const end = document.createElement('button');
end.classList.add('end-page-btn');
end.classList.add('pagination-btn');
document.getElementById('pagination-container').appendChild(end);

// const paginationGrid = document.querySelector('.pagination-container');
// const paginationBtn = document.querySelector('.pagination-btn');
let genres = [];
let currentPage = 1;
const lastPage = 1000;
const paginationBtnClick = document.querySelector('.pagination-btn');

async function getGenres() {
  const resp = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY_API}`
  );
  const respData = await resp.json();
  genres = respData.genres;
}

function getGenreNameById(id) {
  let genresResult = '';
  genres.forEach(genre => {
    if (genre.id === id) {
      genresResult = genre.name;
    }
  });
  return genresResult;
}

async function getTrendingMovies(page) {
  console.log('Page', page);
  const resp = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${KEY_API}&page=${page}`
  );
  const respData = await resp.json();
  console.log('Get Movies', respData.results);
  return respData.results;
}

async function showTrending() {
  const data = await getTrendingMovies(currentPage);
  updateGrid(data);
  createCardsModal(data);
}

function updateGrid(data) {
  mainGrid.innerHTML = data
    .slice(0, 18)
    .map(e => {
      return `
            <div class="card" id="${e.id}">
        <div class="img">
            <img src="
            ${noImage(e.poster_path)}" loading="lazy">
        </div>
        <div class="info">
            <h2 class="movie-name">${e.title}</h2>
                <div class="single-info">
                      ${e.genre_ids
                        .slice(0, 2)
                        .map(
                          genre_id =>
                            `<span class="genre-li"> ${getGenreNameById(
                              genre_id
                            )} </span>`
                        )}  <span class = "info-span">&#124;</span><span >${Number.parseInt(
        e.release_date
      )}</span><span class = release-rating> ${Number.parseFloat(
        e.vote_average
      ).toFixed(2)}</span>
                </div>
        </div>
    </div>
      `;
    })
    .join('');
}

function createCardsModal(data) {
  const cards = document.getElementsByClassName('card');
  [...cards].forEach(card => {
    const movieData = data.find(e => e.id.toString() === card.id.toString());
    card.addEventListener('click', () => showModal(movieData));
  });
}

function noImage(pic) {
  if (pic === null) {
    return 'https://billuchi.com/wp-content/themes/barberry/images/placeholder.jpg';
  } else {
    return `https://image.tmdb.org/t/p/w1280${pic}`;
  }
}
// SEARCH MOVIE
async function searchMovie(searchWord) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${KEY_API}&query=${searchWord}
    `
  );
  const respData = await resp.json();
  return respData.results;
}

async function searchedMovies() {
  const data = await searchMovie(input.value);

  mainGrid.innerHTML = data
    .map(e => {
      return `
    <div class="card" id="${e.id}">
        <div class="img">
            <img src="${IMAGE_PATH + e.poster_path}">
        </div>
        <div class="info">
            <h2 class="movie-name">${e.title}</h2>
                <div class="single-info">
                    <span>${
                      e.genre_ids
                    }</span> <span>&#124;</span> <span>${Number.parseInt(
        e.release_date
      )}</span><span>Rating: ${e.vote_average}</span>
                </div>
        </div>
    </div>
      `;
    })
    .join('');

  const cards = document.getElementsByClassName('card');
  // console.log('рендер пошуку', cards);
  [...cards].forEach(card => {
    const movieData = data.find(e => e.id.toString() === card.id.toString());
    card.addEventListener('click', () => showModal(movieData));
  });
}

// MODAL
async function getMovieTrailer(movieId) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${KEY_API}`
  );
  const respData = await resp.json();
  return respData.results[0].key;
}

async function showModal(movieData) {
  const movieTrailer = await getMovieTrailer(movieData.id);
  // console.log(movieTrailer);
  modalContainer.classList.add('show-modal-container');
  modalContainer.style.background = `linear-gradient(#9d5727, #00000073),
        url(${IMAGE_PATH + movieData.poster_path})`;
  modalContainer.style.backgroundRepeat = 'no-repeat';
  modalContainer.style.backgroundSize = 'cover';
  modalContainer.style.backgroundPosition = 'center';
  modalContainer.innerHTML = `<span class="modal-x">&#10006</span>
        <div class="modal-content">
            <div class="modal-left">
                <div class="modal-poster-img">
                    <img class="modal-img" src="${
                      IMAGE_PATH + movieData.poster_path
                    }" alt="">
                </div>
            </div>
            <div class="modal-right">
                <h2 class="modal-movie-name" id="modal-movie-name">${
                  movieData.title
                }</h2>
                <div class="modal-poster-info">
                  <div class="modal-box">
                    <h4 class="modal-vote grey-style">Vote <span class="modal-vote-span grey-style">/</span> Votes</h4>
                    <p class="modal-rating"> ${
                      movieData.vote_average
                    } </p><span class="modal-rating-span black-style">/</span><p class="black-style">${
    movieData.vote_count
  }</p></div>
                <div class="modal-box">
                    <h4 class="modal-popularity grey-style">Popularity</h4>
                    <p class="modal-popularity-score black-style">${
                      movieData.popularity
                    }</p>
                    </div>
                    <div class="modal-box">
                    <h4 class="modal-title grey-style">Original Title</h4>
                    <p class="modal-title-name black-style">${
                      movieData.title
                    }</p>
                    </div>
                    <div class="modal-box">
                    <h4 class="modal-genre grey-style">Genre</h4>
                    <p class="modal-genre-id black-style">${movieData.genre_ids
                      .slice(0, 3)
                      .map(
                        genre_id =>
                          `<span> ${getGenreNameById(genre_id)} </span>`
                      )
                      .join('')}</p>
                    </div>
                    <h3 class="modal-about">About</h3>
                    <p class="modal-about-text">${movieData.overview}</p>
                    <div class="buttons">
                      <button class="queue">ADD TO QUEUE</button>
                      <button class="watched">ADD TO WATCHED</button>
                    </div>
                </div>
                <div class="trailer">
                    <h2 class="trail">Trailer</h2>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${movieTrailer}" title="YouTube video player"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></ifr>
                </div>
            </div>
        </div>`;

  const xIcon = document.querySelector('.modal-x');
  xIcon.addEventListener('click', () =>
    modalContainer.classList.remove('show-modal-container')
  );

  const watched = document.querySelector('.watched');
  watched.addEventListener('click', () => {
    if (watched.classList.contains('hover')) {
      watched.classList.remove('hover');
    } else {
      watched.classList.add('hover');
    }
  });

  const queue = document.querySelector('.queue');
  queue.addEventListener('click', () => {
    if (queue.classList.contains('hover')) {
      queue.classList.remove('hover');
    } else {
      queue.classList.add('hover');
    }
  });
}

// PAGINATION
function nextPage() {
  currentPage++;
  paginationBtn.textContent = currentPage;
  paginationBtnLeft.textContent = currentPage - 1;
  paginationBtnRight.textContent = currentPage + 1;
  changePaginationStyle();
  showTrending();
}
function prevPage() {
  currentPage--;
  if (currentPage < 1) currentPage = 1;
  paginationBtn.textContent = currentPage;
  paginationBtnLeft.textContent = currentPage - 1;
  paginationBtnRight.textContent = currentPage + 1;
  changePaginationStyle();
  showTrending();
}
function goToPage(pageNumber) {
  currentPage = pageNumber;
  paginationBtn.classList.add('active');
  paginationBtn.textContent = currentPage;
  paginationBtnLeft.textContent = currentPage - 1;
  paginationBtnRight.textContent = currentPage + 1;
  changePaginationStyle();
  showTrending();
}
function endPage() {
  currentPage = 1000;
  paginationBtn.textContent = currentPage;
  paginationBtnLeft.textContent = currentPage - 1;
  paginationBtnRight.textContent = currentPage + 1;
  changePaginationStyle();
  showTrending();
}
function firstPage() {
  currentPage = 1;
  paginationBtn.textContent = currentPage;
  paginationBtnLeft.textContent = currentPage - 1;
  paginationBtnRight.textContent = currentPage + 1;
  changePaginationStyle();
  showTrending();
}

function changePaginationStyle() {
  if (currentPage === 1) {
    start.classList.add('visually-hidden');
    prev.classList.add('visually-hidden');
    next.classList.remove('visually-hidden');
    paginationBtnLeft.classList.add('visually-hidden');
  } else if (currentPage === 2) {
    prev.classList.remove('visually-hidden');
    start.classList.add('visually-hidden');
    paginationBtnLeft.classList.remove('visually-hidden');
  } else {
    start.classList.remove('visually-hidden');
    paginationBtnLeft.classList.remove('visually-hidden');
  }

  if (currentPage === lastPage) {
    prev.classList.remove('visually-hidden');
    end.classList.add('visually-hidden');
    next.classList.add('visually-hidden');
    paginationBtnRight.classList.add('visually-hidden');
  } else if (currentPage === 999) {
    next.classList.remove('visually-hidden');
    end.classList.add('visually-hidden');
    paginationBtnRight.classList.remove('visually-hidden');
  } else {
    end.classList.remove('visually-hidden');
    paginationBtnRight.classList.remove('visually-hidden');
  }
}

function addListeners() {
  start.addEventListener('click', firstPage);
  prev.addEventListener('click', prevPage);
  paginationBtnLeft.addEventListener('click', prevPage);
  paginationBtnRight.addEventListener('click', nextPage);
  next.addEventListener('click', nextPage);
  end.addEventListener('click', endPage);
  searchBtn.addEventListener('click', searchedMovies);
}

getGenres();
addListeners();
showTrending();
goToPage(1);
