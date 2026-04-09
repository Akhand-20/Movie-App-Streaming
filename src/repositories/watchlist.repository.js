import Watchlist from '../schemas/Watchlist.model.js'

const watchlistRepository = {

  async findByUserId(userId) {
    return await Watchlist.findOne({ userId })
  },

  async createWatchlist(userId) {
    const watchlist = new Watchlist({ userId, movies: [] })
    return await watchlist.save()
  },

  async addMovie(userId, movieData) {
    return await Watchlist.findOneAndUpdate(
      { userId },
      { $push: { movies: movieData } },
      { new: true, runValidators: true, upsert: true }
    )
  },

  async removeMovie(userId, tmdbId) {
    return await Watchlist.findOneAndUpdate(
      { userId },
      { $pull: { movies: { tmdbId: tmdbId } } },
      { new: true }
    )
  },

  async clearWatchlist(userId) {
    return await Watchlist.findOneAndUpdate(
      { userId },
      { $set: { movies: [] } },
      { new: true }
    )
  },

  async getMovieCount(userId) {
    const watchlist = await Watchlist.findOne({ userId }).select('movies')
    return watchlist ? watchlist.movies.length : 0
  }

}

export default watchlistRepository