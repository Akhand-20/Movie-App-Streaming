import watchlistService from '../services/watchlist.service.js'
import responseFormatter from '../utils/responseFormatter.js'

const watchlistController = {

  async getWatchlist(req, res, next) {
    try {
      const watchlist = await watchlistService.getWatchlist(req.user.id)
      return responseFormatter.success(res, watchlist, 'Watchlist fetched successfully')

    } catch (error) {
      next(error)
    }
  },

  async addMovie(req, res, next) {
    try {
      const {
        tmdbId,
        title,
        posterPath,
        backdropPath,
        rating,
        releaseYear,
        overview
      } = req.body

      if (!tmdbId || !title) {
        return responseFormatter.error(res, 'tmdbId and title are required', 400)
      }

      const watchlist = await watchlistService.addMovie(req.user.id, {
        tmdbId,
        title,
        posterPath,
        backdropPath,
        rating,
        releaseYear,
        overview
      })

      return responseFormatter.success(res, watchlist, 'Movie added to watchlist')

    } catch (error) {
      next(error)
    }
  },

  async removeMovie(req, res, next) {
    try {
      const { tmdbId } = req.params

      if (!tmdbId) {
        return responseFormatter.error(res, 'tmdbId is required', 400)
      }

      const watchlist = await watchlistService.removeMovie(req.user.id, tmdbId)
      return responseFormatter.success(res, watchlist, 'Movie removed from watchlist')

    } catch (error) {
      next(error)
    }
  },

  async clearWatchlist(req, res, next) {
    try {
      const watchlist = await watchlistService.clearWatchlist(req.user.id)
      return responseFormatter.success(res, watchlist, 'Watchlist cleared')

    } catch (error) {
      next(error)
    }
  },

  async isInWatchlist(req, res, next) {
    try {
      const { tmdbId } = req.params
      const result = await watchlistService.isInWatchlist(req.user.id, tmdbId)
      return responseFormatter.success(res, { isInWatchlist: result }, 'Check complete')

    } catch (error) {
      next(error)
    }
  }

}

export default watchlistController