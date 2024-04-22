const processEnv = {};
const envs = {...process.env, ...process.client_envs};
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});
const config = {
  LogLevel: 'debug',
  Port: '8082',
  Env: 'pre', //mocked
  Component: 'unified-search',
  Version: '',
  MaxSearchResults: 50,
  DataLoadIntervalSeconds: 30,
  AnalyticsServiceEndpoint: 'https://analytics.universalconnectproject.org/api/',
  AuthServiceEndpoint: 'https://login.universalconnectproject.org/api/',
  DATABASE_URL: 'http://static.universalconnectproject.org.s3.us-west-2.amazonaws.com/search/',
  S3Bucket: 'dev.universalconnectproject.org', // leave blank to use local server hardcoded preference
  LocalDefaultProvider: 'sophtron', //default provider config when S3Bucket is not used.
  AwsRegion: 'us-west-2',
};;

const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;