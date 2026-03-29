import mongoose from 'mongoose'

const movieItemSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    posterPath: {
      type: String,
      default: null
    },
    backdropPath: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: 0
    },
    releaseYear: {
      type: String,
      default: ''
    },
    overview: {
      type: String,
      default: ''
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
)

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    movies: {
      type: [movieItemSchema],
      default: [],
      validate: {
        validator: function (movies) {
          return movies.length <= 100
        },
        message: 'Watchlist cannot exceed 100 movies'
      }
    }
  },
  {
    timestamps: true
  }
)



watchlistSchema.methods.hasMovie = function (tmdbId) {
  return this.movies.some(movie => movie.tmdbId === tmdbId)
}

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

export default Watchlist