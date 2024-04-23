const { InstitutionResponse, Configuration, CredentialRequest, MxPlatformApiFactory } = require('./sdk')
const config = require('../config')
const logger = require('../../infra/logger')

const mxConfigInt = {
  username: config.MxClientId,
  password: config.MxApiSecret,
  demoUserId: config.MxDemoUserId,
  demoMemberId: config.MxDemoMemberId,
  basePath: 'https://int-api.mx.com'
}

const mxConfigProd = {
  username: config.MxClientIdProd,
  password: config.MxApiSecretProd,
  basePath: 'https://api.mx.com'
}

const mx = {
  baseOptions: {
    headers: {
      Accept: 'application/vnd.mx.api.v1+json'
    }
  }
}
async function batchLoadInstitutions (env) {
  const conf = new Configuration(env === 'prod' ? { ...mxConfigProd, ...mx } : { ...mxConfigInt, ...mx })
  // console.log(conf)
  const apiClient = MxPlatformApiFactory(conf)
  logger.info('loading mx institutions')
  // logger.info(mx);
  let totalPages = 141
  const all = []
  const promises = []
  for (let i = 1; i <= totalPages; i++) {
    promises.push(
      apiClient.listInstitutions(undefined, i, 100).then(ret => {
        const { pagination, institutions } = ret.data
        totalPages = pagination.total_pages
        // logger.info(ret.data)
        logger.info(`Loaded page ${pagination.current_page}, per_page: ${pagination.processCsv}, total_entries: ${pagination.total_entries}, total_pages: ${pagination.total_pages}`)
        if (institutions.length) {
          all.push(...institutions)
        }
      }).catch(err => {
        logger.error(`Error getting mx institutions, page: ${i}`, err?.response?.data)
        throw err
      })
    )
  }
  await Promise.all(promises)
  logger.info(`loaded ${all.length} mx institutions`)
  return all
}
module.exports = {
  batchLoadInstitutions
}
