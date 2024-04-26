require('dotenv').config({ override: true })
const config = require('./config.js')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const api = require('./api.js')
const preference = require('./preference.js')
const logger = require('../infra/logger.js')
const { handlePing } = require('./apiHandlers.js')

process.on('unhandledRejection', error => {
  logger.error('unhandledRejection: ' + error.message, error)
})

const app = express()
app.use(function (err, req, res, next) {
  if (err) {
    logger.err('Unhandled error: ', err)
    res.sendStatus(500)
  }
})
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/ping', handlePing)

api.mapApi(app)
preference.mapApi(app)

app.get('*', function (req, res) {
  res.sendStatus(404)
})

app.listen(config.Port, () => {
  const message = `Server is running on port ${config.Port}, env: ${config.Env}`
  logger.info(message)
})
