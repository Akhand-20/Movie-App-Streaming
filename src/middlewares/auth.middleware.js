import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError.js'

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new ApiError(401, 'Access denied. Invalid token format')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'))
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired. Please login again'))
    }
    next(error)
  }
}

export default authMiddleware