import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

import userRoutes from './routes/user.routes.js'
import watchlistRoutes from './routes/watchlist.routes.js'
import movieRoutes from './routes/movie.routes.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use('/api/auth', userRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/movies', movieRoutes)

app.use('*splat', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

export default app


