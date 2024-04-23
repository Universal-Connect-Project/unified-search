const logger = require('../infra/logger')
const config = require('./config')
const utils = require('../utils')
const axios = require('axios')
const tools = require('../indexer/tools')
const url = require('url');
const { getPreference } = require('./preference')

let db = {
}
let defaultPref;

function weightByPerformance(metrics, pref){
  let { weights_conf = defaultPref.weights_conf } = (pref || {} ); 
  let weights = metrics.providers;
  for( let [provider, metric] of Object.entries(metrics.providers)){
    weights[provider].weight = 0;
    if(!metric.success_rate){
      continue;
    }
    let value = metric.success_rate[weights_conf.success_rate.use_field];
    for( let conf of weights_conf.success_rate.buckets){
      if(conf.from <= value && conf.to > value){
        weights[provider].weight += (conf.weight * (weights_conf.success_rate.ratio || 0.5));
      }
    }
    value = metric.time_cost[weights_conf.time_cost.use_field];
    for( let conf of weights_conf.time_cost.buckets){
      if(conf.from <= value && conf.to > value){
        weights[provider].weight += (conf.weight * (weights_conf.time_cost.ratio || 0.5));
      }
    }
  }
  let selected_provider = 'sophtron'
  let selected_weight = 0;
  for(let [provider, value] of Object.entries(weights)){
    if(selected_weight < value.weight){
      selected_weight = value.weight;
      selected_provider = provider
    }
  }
  return {
    provider: selected_provider,
    weight: selected_weight,
    weights,
  };
}

async function loadData(){
  let start = new Date();

  function elapsedSeconds(){
    return (new Date() - start) / 1000;
  }

  let versions = await axios.get(`${config.DataBaseUrl}version.json`).then(res => res.data);
  let version = versions[config.Env ? config.Env.toLowerCase() : 'dev'];
  let ret = {version};

  if(db.version === version){
    logger.info(`Data version unchanged: ${version}`)
    return
  }

  logger.info(`Loading data, version: ${version}, ${elapsedSeconds()}s`);

  const response = await axios.get(config.DataBaseUrl + `db/${version}.csv`, {
    responseType: 'stream'
  }).catch(err => {
    if(err?.response?.status === 404){
      return [];
    }
  });

  const stream = response?.data;
  if(!stream){
    return [];
  }

  let arr = (await utils.processCsv(stream));
  if(!arr){
    return [];
  }

  logger.info(`loaded data: ${arr.length}, ${elapsedSeconds()}s`);
  ret.data = arr.map((row) => row[0]);
  logger.info(`Loading index, version: ${version}, ${elapsedSeconds()}s`);
  //ret.searchIndex = tools.buildIndex(arr); 

  const indexResponse = await axios.get(config.DataBaseUrl + `db/${version}.txt`, {
    responseType: 'stream'
  }).catch(err => {})

  const indexStream = indexResponse?.data;
  if(!indexStream){
    logger.warning(`Unable to find cached index, building, ${elapsedSeconds()}s`)
    ret.searchIndex = tools.buildIndex(arr); 
  }else{
    ret.searchIndex = await utils.processFileStream(indexStream, tools.deserializeIndexRow, new Map())
    logger.info(`Loaded index: ${ret.searchIndex.size}, ${elapsedSeconds()}s`);
  }

  let providers = arr[0][4].replace('foreignKeys(', '').replace(')', '').split(';')
  logger.info(`Building key index, ${elapsedSeconds()}s, providers: ${providers.join(';')}`);
  ret.keyIndex = arr.reduce((obj, row, index) => {
    if(index === 0){
      return obj;
    }

    let item = {
      id: row[0],
      name: row[1].replace(config.CsvEscape, ','),
      url: row[2],
      logo_url: row[3],
      fks: {}
    }

    let fks = row[4].split(';');
    for(let i = 0; i < providers.length; i++){
      if(fks[i]){
        item.fks[providers[i]] = fks[i]
      }
    }

    // consider returning the only provider entry so resolving is not needed
    // if(Object.keys(item.fks).length === 1){
    //   item.provider = Object.keys()[0];
    //   item.id = Object.values()[0];
    // }
    obj.set(item.id, item);
    return obj;
  }, new Map())

  logger.info(`Initial data loaded and indexed, ${elapsedSeconds()}s`);
  db = ret;
}
loadData();
setInterval(loadData, config.DataLoadIntervalSeconds * 1000)

async function searchInstitutions(name, providers){
  if(!db.data){
    await loadData();
  }
  if(providers.filter(p=>p).length === 0){
    providers = undefined;
  }
  let queries = decodeURIComponent(name || '')
    .toLowerCase().split(' ')
    .filter(s => s.trim().length > 1)
    .map(s => s.trim());
  let findings = queries.map((q, i) => (db.searchIndex.get(q) || []).filter(t => t.order >= i)).filter(a => a.length > 0);

  let urlIndex = new Set();
  let domainIndex = new Set();
  let nameIndex = {};

  let matches = findings.length == 1 ? (findings[0] || []).map(item => item.row) : findings.reduce((arr, cur, index) => {
    for(let item of cur){
      let id = db.data[item.row];
      let entry = db.keyIndex.get(id);
      if(arr.length > config.MaxSearchResults && !entry.name === name){
        return arr;
      }
      if(arr.indexOf(item.row) > -1){
        return arr
      }
      if(findings.every((numbers, i) => i === index || numbers.some(t => t.row === item.row ))){
        //filter to remove dup or non-logo entries from matched result
        if(entry){
          if(!providers || providers.some(p => entry.fks[p])){
            arr.push(item.row)
          }
        }
      }
    }
    return arr;
  }, [])
  return {
    // queries,
    // findings: `${findings.length}, ${findings.map(a => a.length).join(',')}`,
    // matches,
    institutions: matches.map(m => {
      //let rowNumber = m.substring(1);
      let id = db.data[m];
      let entry = db.keyIndex.get(id);
      return {
        // index: m,
        name: entry.name,
        id,
        url: entry.url,
        logo_url: entry.logo_url,
        providers: entry.fks
      };
    })//.sort((a,b) => a.name.length - b.name.length)
  }
}

module.exports = {
  mapApi: function(app){
    app.get('/api/providers', function(req, res){
      res.send(['sophtron', 'mx', 'finicity', 'akoya'])
    }),
    app.get('/api/institutions/:provider?', async function(req, res){
      // let { provider } = req.params;
      let { query, providers } = req.query;
      if(query){
        let ps = decodeURIComponent(providers || '').split(';');
        let ret = await searchInstitutions(query, ps);
        res.send(ret);
        return;
      }else{
        let pref = await getPreference(req);
        if(!pref){
          res.sendStatus(401);
          return;
        }
        res.send({institutions: pref.defaultBanks})
      }
    })
    app.get('/api/institution/resolve/:to_provider?', async function(req, res){
      let { id, cache : useCache } = req.query;
      let { to_provider} = req.params;
      let item = db.keyIndex.get(id);
      let weights;
      let cached = useCache !== 'false';
      if(!item){
        res.sendStatus(404);
        return;
      }
      if(!to_provider || to_provider === 'auto'){
        let pref = await getPreference(req);
        if(!pref){
          res.sendStatus(401);
          return;
        }
        if(!to_provider){
          to_provider = pref.providerMapping[id]?.provider || pref.defaultProvider;
        }else{
          let name = item.name.toLowerCase().replace(/[ \.,()]/g, '_').replace(/_+/g, '_');
          let getFn = () => {
            const url = `${config.AnalyticsServiceEndpoint}${name}/metrics/uvcs/dummystart/dummyend`;
            logger.trace(`Getting analytics data from ${url}`)
            return axios.get(url).then(res => {
              logger.debug(`Received analytics data from`, res.data)
              return res.data
            }).catch(err => {
              logger.error(`Error getting analytics data from ${url}`, err)
            })
          }
          let key = `${config.Component}/metrics/${name}`
          let metrics = await (cached ? cache.getOrSet(key, getFn) : getFn())
          if(!cached){
            await cache.set(key, metrics)
          }
          let ret = weightByPerformance(metrics, pref)
          to_provider = ret?.provider
          weights = ret?.weights
        }
      }
      
      if(to_provider && item.fks[to_provider]){
        res.send({
          target_id: item.fks[to_provider],
          provider: to_provider,
          logo_url: item.logo_url,
          name: item.name,
          url: item.url,
          weights,
          cached: weights ? cached : undefined
        })
        return;
      }else{
        for(let p in item.fks){
          if(item.fks[p]){
            res.send({
              target_id: item.fks[p],
              name: item.name,
              provider: p,
              logo_url: item.logo_url,
              url: item.url,
              weights,
              cached: weights ? cached : undefined
            })
            return;
          }
        }
      }
    })
  }
}