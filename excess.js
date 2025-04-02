try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`)
    const data = await res.json()
    

    if (data.results.length > 0) {
    const movieId = data.results[0].id

    const relatedRes = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`)
    const relatedData = await relatedRes.json()
    // console.log('related results', relatedData.results)
    if(relatedData.results.length > 0) {
        updateMovieList(relatedData.results)
        console.log('related', relatedData)
    } else {
        console.warn('no related movies found')
        movieList.innerHTML = "<p>No related movies available.</p>";
    }
} 
} catch (error) {
    console.error('error fetching related movies')
}