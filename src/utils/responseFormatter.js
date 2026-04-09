const responseFormatter = {

  success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    })
  },

  created(res, data, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    })
  },

  error(res, message = 'Something went wrong', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null
    })
  }

}

export default responseFormatter