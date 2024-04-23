const s3 = require('../utils/s3')
const config = require('./config')
const logger = require('../infra/logger')
const http = require('../infra/http')
const localPref = require('./defaultPreference')

const s3Client = config.S3Bucket ?  s3({
  region: config.AwsRegion,
  bucket: config.S3Bucket
}) : null;

const s3Prefix = `search/${config.Env}/`
let defaultPref;

async function auth(req){
  const user = await http.get(`${config.AuthServiceEndpoint}auth`, {Authorization: req.headers.authorization})
    .catch(err => {
      logger.trace(`Auth failed with header value: ${req.headers.authorization}`, err);
    })
  return user;
}

async function getPreference(req, noDefault){
  if(!s3Client){
    localPref.defaultProvider = config.LocalDefaultProvider
    return localPref;
  }
  const user = await auth(req);
  const partner = user?.name;
  if(partner) {
    logger.trace(`Getting preferences for partner: ${partner}`)
    let ret = await s3Client.GetObject(`${s3Prefix}preferences/${partner}/default.json`, true);
    logger.trace(`Preferences for partner: ${partner}:`)
    if(ret){
      return ret
    }else if(noDefault){
      return {}
    }
  }else{
    return null;
  }
  return defaultPref || (defaultPref = await http.wget(config.DATABASEURL + 'preferences/default.json'));
}

module.exports = {
  getPreference,
  auth,
  mapApi(app){
    app.get('/api/preference', async function(req, res){
      let ret = await getPreference(req, true)
      if(ret){
        res.send(ret)
        return;
      }
      res.sendStatus(401)
    })
    app.put('/api/preference', async function(req, res){
      if(!s3Client){
        res.sendStatus(400)
      }
      const user = await auth(req);
      if(user?.name){
        await s3Client.PutObject(`${s3Prefix}preferences/${user.name.toLowerCase()}/default.json`, JSON.stringify(req.body))
        res.sendStatus(200)
        return;
      }
      res.sendStatus(401)
    })
  }
}