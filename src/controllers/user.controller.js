import userService from '../services/user.service.js'
import responseFormatter from '../utils/responseFormatter.js'

const userController = {

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return responseFormatter.error(res, 'Name, email and password are required', 400)
      }

      const result = await userService.register(name, email, password)

      return responseFormatter.created(res, result, 'Account created successfully')

    } catch (error) {
      next(error)
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return responseFormatter.error(res, 'Email and password are required', 400)
      }

      const result = await userService.login(email, password)

      return responseFormatter.success(res, result, 'Login successful')

    } catch (error) {
      next(error)
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id)
      return responseFormatter.success(res, user, 'Profile fetched successfully')

    } catch (error) {
      next(error)
    }
  },

  async updatePreferences(req, res, next) {
    try {
      const { preferences } = req.body

      if (!preferences || typeof preferences !== 'object') {
        return responseFormatter.error(res, 'Preferences object is required', 400)
      }

      const user = await userService.updatePreferences(req.user.id, preferences)
      return responseFormatter.success(res, user, 'Preferences updated successfully')

    } catch (error) {
      next(error)
    }
  }

}

export default userController