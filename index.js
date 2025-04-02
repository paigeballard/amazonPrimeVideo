const API_KEY =  '8cc98cba1a98a1ed47943b649df34711'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

let currentIndex = 0
const moviesPerPage = 6
let moviesData = []


// fetch movie for hero section
async function fetchHeroMovie(movieTitle) {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`)
        const data = await res.json()
        if(data.results.length > 0) {
            const movie = data.results[0]
            updateHeroSection(movie)
            fetchRelatedMovies(movie.title)
        } else {
            console.error('movie not found')
        }
    } catch (error) {
        console.error('error fetching movie', error)
    }
}

// update hero/movie info
function updateHeroSection(movie) {
    document.querySelector('.container').style.backgroundImage = `linear-gradient(to right top, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    document.getElementById('hero-title').textContent = movie.title
    // document.getElementById('hero-subtitle').textContent = ''

    const maxOverviewLength = 200; // Set a character limit
    const truncatedOverview = movie.overview.length > maxOverviewLength
        ? movie.overview.substring(0, maxOverviewLength) + "..."
        : movie.overview;

    document.getElementById('hero-release-date').textContent = `Release Date -  ${movie.release_date}`
    document.getElementById('hero-overview').textContent = truncatedOverview
}

function fetchRelatedMovies(movieTitle) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const movie = data.results[0]; // Get the first matching movie
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${API_KEY}`)
                    .then(response => response.json())
                    .then(similarData => {
                        if (similarData.results.length > 0) {
                            updateMovieList(similarData.results); // Update the movie list
                        } else {
                            console.warn("No related movies found.");
                            movieList.innerHTML = "<p>No related movies available.</p>";
                        }
                    })
                    .catch(error => console.error("Error fetching related movies:", error));
            } else {
                console.error("Movie not found for fetching related movies.");
            }
        })
        .catch(error => console.error("Error fetching movie by title:", error));
}

//update movie list based on current index
function updateMovieList(movies) {
    movieList.innerHTML = ''

    // const visibleMovies = moviesData.slice(currentIndex, currentIndex + moviesPerPage);
    const visibleMovies = movies.slice(0, 4)
    visibleMovies.forEach(movie => {
        const movieItem = document.createElement('div')
        movieItem.classList.add('movie-item')
        movieItem.style.backgroundImage = `url(${IMAGE_BASE_URL}${movie.poster_path})`
        //movieItem.textContent = movie.title

        // add click event to update hero section
        movieItem.addEventListener('click', function() {
            fetchHeroMovie(movie.title)
        })

        movieList.appendChild(movieItem)
    })

}

// search button click event
document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.trim()
    //const movieTitle = searchInput.value.trim()

    if (searchInput) {
        fetchHeroMovie(searchInput)
    }
})

// search input slide in and out
document.getElementById('searchButton').addEventListener('click', function() {
    const searchContainer = document.getElementById('searchContainer')
    searchContainer.classList.toggle('active')
    document.getElementById('searchInput').focus()
})

// handle search when pressing enter
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const movieTitle = this.value.trim()
        if (movieTitle) {
            fetchHeroMovie(movieTitle)
        }
    }
})

window.onload = function () {
    fetchHeroMovie("You're Cordially Invited")
    fetchRelatedMovies("You're Cordially Invited")
}
