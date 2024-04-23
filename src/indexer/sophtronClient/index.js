const crypto = require('crypto')
const axios = require('axios')
const config = require('../config')
const logger = require('../../infra/logger')

const userId = config.SophtronApiUserId
const accessKey = config.SophtronApiUserSecret
const apiBaseUrlInternal = 'http://financial-api.sophtron-prod.com/api/'
const apiBaseUrl = 'https://api.sophtron-prod.com/api/'
const apiEndpoints = {
  BatchLoadInstitutions: 'Institution/BatchLoadInstitutions'
}
// logger.info(userId);
// logger.info(accessKey);
function buildAuthCode (httpMethod, url) {
  const authPath = url.substring(url.lastIndexOf('/')).toLowerCase()
  const integrationKey = Buffer.from(accessKey, 'base64')
  const plainKey = httpMethod.toUpperCase() + '\n' + authPath
  const b64Sig = crypto.createHmac('sha256', integrationKey).update(plainKey).digest('base64')
  const authString = 'FIApiAUTH:' + userId + ':' + b64Sig + ':' + authPath
  return authString
}

function post (url, data, baseUrl) {
  const conf = { headers: { Authorization: buildAuthCode('post', url) }, timeout: 320000 }
  return axios.post((baseUrl || apiBaseUrl) + url, data, conf)
    .then(res => {
      logger.info('response from ' + url)
      // logger.info(res.data);
      return res.data
    })
    .catch(err => {
      logger.error('error from ' + url, err)
      // logger.info(error.message);
    })
}

function batchGetInstitutions () {
  return post(apiEndpoints.BatchLoadInstitutions)
}

module.exports = {
  batchGetInstitutions
}
