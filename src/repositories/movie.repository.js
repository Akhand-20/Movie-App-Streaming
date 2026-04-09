import CachedMovie from '../schemas/Cachedmovie.model.js'

const movieRepository = {

  async findCached(tmdbId, type) {
    return await CachedMovie.findOne({
      tmdbId,
      type,
      expiresAt: { $gt: new Date() }
    })
  },

  async saveCache(tmdbId, type, data) {
    return await CachedMovie.findOneAndUpdate(
      { tmdbId, type },
      {
        tmdbId,
        type,
        data,
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      },
      { upsert: true, new: true }
    )
  },

  async deleteCache(tmdbId, type) {
    return await CachedMovie.findOneAndDelete({ tmdbId, type })
  },

  async clearAllCache() {
    return await CachedMovie.deleteMany({})
  },

  async isCached(tmdbId, type) {
    const cached = await CachedMovie.findOne({
      tmdbId,
      type,
      expiresAt: { $gt: new Date() }
    }).select('_id')
    return !!cached
  }

}

export default movieRepository