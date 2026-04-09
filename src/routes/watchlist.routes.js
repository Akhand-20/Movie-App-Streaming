import express from 'express'
import watchlistController from '../controllers/watchlist.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', watchlistController.getWatchlist)
router.post('/', watchlistController.addMovie)
router.delete('/clear', watchlistController.clearWatchlist)
router.get('/check/:tmdbId', watchlistController.isInWatchlist)
router.delete('/:tmdbId', watchlistController.removeMovie)

export default router
