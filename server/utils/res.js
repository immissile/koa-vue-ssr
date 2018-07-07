import merge from 'lodash/merge'

// api result
export default ({
  data,
  error,
  code = 200,
  success = true
}) => {
  if (error) {
    success = false
  }
  let res = {success}
  if (success) {
    return merge({}, res, {
      data
    })
  }
  return merge({}, res, {
    success: false,
    error,
    code
  })
}
