import mongoose from 'mongoose'

const cachedMovieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['movie', 'trending', 'toprated', 'search', 'genre'],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    cachedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000)
    }
  }
)

cachedMovieSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
cachedMovieSchema.index({ tmdbId: 1, type: 1 })

const CachedMovie = mongoose.model('CachedMovie', cachedMovieSchema)

export default CachedMovie