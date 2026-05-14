import movieService from '../services/movie.service.js'
import responseFormatter from '../utils/responseFormatter.js'

const movieController = {

  async getTrending(req, res, next) {
    try {
      const data = await movieService.getTrending()
      return responseFormatter.success(res, data, 'Trending movies fetched')

    } catch (error) {
      next(error)
    }
  },

  async getTopRated(req, res, next) {
    try {
      const data = await movieService.getTopRated()
      return responseFormatter.success(res, data, 'Top rated movies fetched')

    } catch (error) {
      next(error)
    }
  },

  async getByGenre(req, res, next) {
    try {
      const { genreId } = req.params

      if (!genreId) {
        return responseFormatter.error(res, 'genreId is required', 400)
      }

      const data = await movieService.getByGenre(genreId)
      return responseFormatter.success(res, data, 'Movies fetched by genre')

    } catch (error) {
      next(error)
    }
  },

  async getMovieDetails(req, res, next) {
    try {
      const { id } = req.params

      if (!id) {
        return responseFormatter.error(res, 'Movie id is required', 400)
      }

      const data = await movieService.getMovieDetails(id)
      return responseFormatter.success(res, data, 'Movie details fetched')

    } catch (error) {
      next(error)
    }
  },

  async searchMovies(req, res, next) {
    try {
      const { q, page } = req.query

      if (!q || q.trim().length === 0) {
        return responseFormatter.error(res, 'Search query is required', 400)
      }

      const data = await movieService.searchMovies(q, page || 1)
      return responseFormatter.success(res, data, 'Search results fetched')

    } catch (error) {
      next(error)
    }
  },

  async getMovieVideos(req, res, next) {
    try {
      const { id } = req.params
      const data = await movieService.getMovieVideos(id)
      return responseFormatter.success(res, data, 'Movie videos fetched')

    } catch (error) {
      next(error)
    }
  },
  async getRecommendations(req, res, next) {
    try {
      const { id } = req.params
      const data = await movieService.getRecommendations(id)
      return responseFormatter.success(res, data, 'Recommendations fetched')
    } catch (error) {
      next(error)
    }
  }

}

export default movieController