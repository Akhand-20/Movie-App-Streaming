import express from 'express'
import userController from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/me', authMiddleware, userController.getMe)
router.patch('/preferences', authMiddleware, userController.updatePreferences)

export default router