import User from '../schemas/User.model.js'

const userRepository = {

  async findByEmail(email) {
    return await User.findOne({ email }).select('+passwordHash')
  },

  async findById(id) {
    return await User.findById(id)
  },

  async createUser(userData) {
    const user = new User(userData)
    return await user.save()
  },

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
  },

  async deleteById(id) {
    return await User.findByIdAndDelete(id)
  },

  async emailExists(email) {
    const user = await User.findOne({ email }).select('_id')
    return !!user
  }

}

export default userRepository