import axios from 'axios'
import movieRepository from '../repositories/movie.repository.js'
import ApiError from '../utils/apiError.js'



const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3'
})

tmdb.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: process.env.TMDB_KEY
  }
  return config
})

const movieService = {

  async getTrending() {
    const cacheKey = { tmdbId: 0, type: 'trending' }

    const cached = await movieRepository.findCached(0, 'trending')
    if (cached) return cached.data

    const { data } = await tmdb.get('/trending/movie/week')
    await movieRepository.saveCache(0, 'trending', data)
    return data
  },

  async getTopRated() {
    const cached = await movieRepository.findCached(1, 'toprated')
    if (cached) return cached.data

    const { data } = await tmdb.get('/movie/top_rated')
    await movieRepository.saveCache(1, 'toprated', data)
    return data 
  },

  async getByGenre(genreId) {
    const cached = await movieRepository.findCached(genreId, 'genre')
    if (cached) return cached.data

    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: genreId }
    })
    await movieRepository.saveCache(genreId, 'genre', data)
    return data
  },

  async getMovieDetails(tmdbId) {
    const id = Number(tmdbId)

    const cached = await movieRepository.findCached(id, 'movie')
    if (cached) return cached.data

    try {
      const [details, videos, credits] = await Promise.all([
        tmdb.get(`/movie/${id}`),
        tmdb.get(`/movie/${id}/videos`),
        tmdb.get(`/movie/${id}/credits`)
      ])

      const movieData = {
        ...details.data,
        videos: videos.data,
        credits: credits.data
      }

      await movieRepository.saveCache(id, 'movie', movieData)
      return movieData

    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError(404, 'Movie not found')
      }
      throw new ApiError(500, 'Failed to fetch movie details')
    }
  },

  async searchMovies(query, page = 1) {
    if (!query || query.trim().length === 0) {
      throw new ApiError(400, 'Search query is required')
    }

    try {
      const { data } = await tmdb.get('/search/movie', {
        params: { query: query.trim(), page }
      })
      return data
    } catch (error) {
      throw new ApiError(500, 'Search failed, please try again')
    }
  },

  async getMovieVideos(tmdbId) {
    try {
      const { data } = await tmdb.get(`/movie/${tmdbId}/videos`)
      const trailer = data.results.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      )
      return trailer || null
    } catch (error) {
      throw new ApiError(500, 'Failed to fetch movie videos')
    }
  }

}

export default movieService