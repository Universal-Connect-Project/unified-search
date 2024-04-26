const { http, HttpResponse } = require('msw')
const { AuthServiceEndpoint } = require('../server/config')
const { user } = require('./testData/user')

module.exports.handlers = [
  http.get(`${AuthServiceEndpoint}auth`, () => HttpResponse.json(user))
]
