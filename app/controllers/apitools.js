_ = require('lodash')

/*
API error format:
{
  message: 'phy-invalid-something: Invalid something.'
  code: 'phy-invalid-something'
  extra: {
    anything: 'else we have from the error'
  }
}
*/

function sendResponse(res, errors, data, statusCode) {
  let response = {
    data: data,
  }

  errors = errors || []

  if (errors.constructor != Array) {
    errors = [errors]
  }

  errors = errors.filter((err) => err)

  if (errors.length == 0) {
    errors = null
  }

  if (!statusCode) {
    if (errors) {
      statusCode = 400
    } else {
      statusCode = 200
    }
  }

  headers = {'content-type': 'application/json; charset=utf-8'}
  res.set(headers).status(statusCode).end(JSON.stringify(response))
}

module.exports = {
  sendResponse: sendResponse,
}
