const { http, HttpResponse } = require('msw')
const { AnalyticsServiceEndpoint } = require("../server/config")
const { providersData } = require('./testData/api')

module.exports.handlers = [
  http.get(`${AnalyticsServiceEndpoint}/ping`, () => HttpResponse.json({})),
  http.get(`${AnalyticsServiceEndpoint}/api/providers`, () => HttpResponse.json(providersData))
]
