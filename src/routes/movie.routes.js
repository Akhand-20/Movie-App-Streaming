import express from 'express'
import movieController from '../controllers/movie.controller.js'

const router = express.Router()

router.get('/trending', movieController.getTrending)
router.get('/top-rated', movieController.getTopRated)
router.get('/search', movieController.searchMovies)
router.get('/genre/:genreId', movieController.getByGenre)
router.get('/:id/videos', movieController.getMovieVideos)
router.get('/:id/recommendations', movieController.getRecommendations)
router.get('/:id', movieController.getMovieDetails)

export default router