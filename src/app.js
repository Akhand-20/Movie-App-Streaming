import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,  // Vite's default port
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

export default app
import User from './schemas/User.model.js'
import Watchlist from './schemas/Watchlist.model.js'
import CachedMovie from './schemas/Cachedmovie.model.js'

console.log('Models loaded:', User.modelName, Watchlist.modelName, CachedMovie.modelName)