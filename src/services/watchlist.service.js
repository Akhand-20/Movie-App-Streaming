import watchlistRepository from '../repositories/watchlist.repository.js'
import ApiError from '../utils/apiError.js'

const MAX_WATCHLIST_SIZE = 100

const watchlistService = {

  async getWatchlist(userId) {
    let watchlist = await watchlistRepository.findByUserId(userId)
    if (!watchlist) {
      watchlist = await watchlistRepository.createWatchlist(userId)
    }
    return watchlist
  },

  async addMovie(userId, movieData) {
    const { tmdbId, title, posterPath, backdropPath, rating, releaseYear, overview } = movieData

    if (!tmdbId || !title) {
      throw new ApiError(400, 'tmdbId and title are required')
    }

    const count = await watchlistRepository.getMovieCount(userId)
    if (count >= MAX_WATCHLIST_SIZE) {
      throw new ApiError(400, `Watchlist cannot exceed ${MAX_WATCHLIST_SIZE} movies`)
    }

    const watchlist = await watchlistRepository.findByUserId(userId)
    if (watchlist && watchlist.hasMovie(tmdbId)) {
      throw new ApiError(409, 'Movie is already in your watchlist')
    }

    return await watchlistRepository.addMovie(userId, {
      tmdbId,
      title,
      posterPath: posterPath || null,
      backdropPath: backdropPath || null,
      rating: rating || 0,
      releaseYear: releaseYear || '',
      overview: overview || ''
    })
  },

  async removeMovie(userId, tmdbId) {
    if (!tmdbId) {
      throw new ApiError(400, 'tmdbId is required')
    }

    const watchlist = await watchlistRepository.findByUserId(userId)
    if (!watchlist || !watchlist.hasMovie(Number(tmdbId))) {
      throw new ApiError(404, 'Movie not found in your watchlist')
    }

    return await watchlistRepository.removeMovie(userId, Number(tmdbId))
  },

  async clearWatchlist(userId) {
    return await watchlistRepository.clearWatchlist(userId)
  },

  async isInWatchlist(userId, tmdbId) {
    const watchlist = await watchlistRepository.findByUserId(userId)
    if (!watchlist) return false
    return watchlist.hasMovie(Number(tmdbId))
  }

}

export default watchlistService