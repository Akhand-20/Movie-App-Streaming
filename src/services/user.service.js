import jwt from 'jsonwebtoken'
import userRepository from '../repositories/user.repository.js'
import ApiError from '../utils/apiError.js'

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

const userService = {

  async register(name, email, password) {
    const emailTaken = await userRepository.emailExists(email)
    if (emailTaken) {
      throw new ApiError(409, 'An account with this email already exists')
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters')
    }

    const user = await userRepository.createUser({
      name,
      email,
      passwordHash: password
    })

    const token = generateToken(user._id)

    return {
      token,
      user: user.toSafeObject()
    }
  },

  async login(email, password) {
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const token = generateToken(user._id)

    return {
      token,
      user: user.toSafeObject()
    }
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    return user.toSafeObject()
  },

  async updatePreferences(userId, preferences) {
    const allowed = ['theme', 'language']
    const filtered = Object.keys(preferences)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[`preferences.${key}`] = preferences[key]
        return obj
      }, {})

    const user = await userRepository.updateById(userId, filtered)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    return user.toSafeObject()
  }

}

export default userService