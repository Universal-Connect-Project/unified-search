require('dotenv').config({ override: true })

const processEnv = {}
const envs = { ...process.env, ...process.client_envs }
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k]
})

const nonSensitiveSharedConfig = {
  Component: 'unified-search'
}

const keysToPullFromEnv = [
  'LogLevel',
  'Port',
  'Env',
  'Version',
  'MaxSearchResults',
  'DataLoadIntervalSeconds',
  'AnalyticsServiceEndpoint',
  'AuthServiceEndpoint',
  'DataBaseUrl',
  'S3Bucket',
  'LocalDefaultProvider',
  'AwsRegion'
]

const config = keysToPullFromEnv.reduce((acc, envKey) => {
  return {
    ...acc,
    [envKey]: processEnv[envKey.toUpperCase()]
  }
}, {
  ...nonSensitiveSharedConfig
})

module.exports = config
