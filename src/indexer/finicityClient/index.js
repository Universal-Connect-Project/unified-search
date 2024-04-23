
const axios = require('axios');
const config = require('../config');
const logger = require('../../infra/logger');

const finicitySandbox = {
  basePath: 'https://api.finicity.com',
  partnerId: config.FinicityPartnerId,
  appKey: config.FinicityAppKey,
  secret: config.FinicitySecret,
  provider: 'finicity_sandbox'
}

const finicityProd = {
  basePath: 'https://api.finicity.com',
  partnerId: config.FinicityPartnerIdProd,
  appKey: config.FinicityAppKeyProd,
  secret: config.FinicitySecretProd,
  provider: 'finicity'
}

function makeFinicityAuthHeaders(apiConfig, tokenRes){
  return {
    'Finicity-App-Key': apiConfig.appKey,
    'Finicity-App-Token': tokenRes.token,
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
}

function getAuthToken(apiConfig){
  return axios.post(apiConfig.basePath + '/aggregation/v2/partners/authentication', {
    'partnerId': apiConfig.partnerId,
    'partnerSecret': apiConfig.secret
  }, {
    headers: {
      'Finicity-App-Key': apiConfig.appKey,
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
}

async function get(apiConfig, path){
  const token = await getAuthToken(apiConfig);
  const headers = makeFinicityAuthHeaders(apiConfig, token);
  const ret = await axios.get(`${apiConfig.basePath}/${path}`, {headers}).then(res => res.data)
  return ret;
}

function getInstitutions(env){
  const apiConfig = env === 'prod' ? finicityProd : finicitySandbox;
  return get(apiConfig, 'institution/v2/institutions');
}

module.exports = {
  getInstitutions
}