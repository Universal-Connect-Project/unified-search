const path = require('path');
require('dotenv').config({override: true});

const processEnv = {};
const envs = {...process.env, ...process.client_envs};
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});

const nonSensitiveSharedConfig = {
  Component: 'unified-search',
  CsvEscape: '^', // the csv parsing script didn't implement the full csv spec, use this to escap ',' and ignore other cases, should make things slightly faster 
  DataSuffix: '_20240210',
  institutionDataPath: path.resolve(path.join(__dirname, '../../../ucp-infrastructure/helm/unified-search/institutionList')),
};

const keysToPullFromEnv = [
  "LogLevel",
  "Env",
  "Version",

  // for data processors
  "SophtronApiUserId",
  "SophtronApiUserSecret",

  "MxApiSecret",
  "MxApiSecretProd",
  "MxClientId",
  "MxClientIdProd",

  "AkoyaClientId",
  'AkoyaApiSecret', 
  "AkoyaClientIdProd",
  "AkoyaApiSecretProd",

  "FinicityPartnerId",
  "FinicityAppKey",
  "FinicitySecret",
  "FinicityPartnerIdProd",
  "FinicityAppKeyProd",
  "FinicitySecretProd",
];

const config = keysToPullFromEnv.reduce((acc, envKey) => {
  return {
    ...acc,
    [envKey]: processEnv[envKey.toUpperCase()]
  }
}, {
  ...nonSensitiveSharedConfig
})

module.exports = config;