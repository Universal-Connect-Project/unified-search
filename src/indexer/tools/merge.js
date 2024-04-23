const utils = require('../../utils');
const config = require('../config');
const fs = require('fs')
const logger = require('../../infra/logger');
const { match } = require('assert');
const mainIndexSchema = [
  'id',
  'name',
  'url',
  'logo',
  'foreignKeys',
  'routing_number'
]
const providers = {
  sophtron: utils.resolveDataFileName('interim/sophtron', '.csv', true),
  mx: utils.resolveDataFileName('interim/mx', '.csv', true),
  akoya: utils.resolveDataFileName('interim/akoya', '.csv', true),
  finicity: utils.resolveDataFileName('interim/finicity', '.csv', true),
  mx_int: utils.resolveDataFileName('interim/mx_int', '.csv', true),
  akoya_sandbox: utils.resolveDataFileName('input/akoya_sandbox_20230604.csv'),
  finicity_sandbox: utils.resolveDataFileName('interim/finicity_sandbox', '.csv', true),
}
const defaultSourceDataSchema = {
  id: 0,
  name: 1,
  url: 2,
  logo: 3,
  routing_number: 4,
}
const mx_sophtron_schema = {
  name: 0,
  mx: 1,
  sophtron: 2,
}
const akoya_sophtron_schema = {
  name: 0,
  akoya: 1,
  sophtron: 2,
}
const akoya_mx_schema = {
  name: 0,
  akoya: 1,
  mx: 2,
}
const finicity_sophtron_schema = {
  name: 2,
  finicity: 0,
  sophtron: 1,
}
const file_names = {
  input: {
    mx_sophtron: utils.resolveDataFileName('interim/mx_sophtron_20240210.csv'),
    akoya_sophtron: utils.resolveDataFileName('interim/akoya_sophtron_20240210.csv'),
    akoya_mx: utils.resolveDataFileName('interim/akoya_mx_20240210.csv'),
    finicity_sophtron: utils.resolveDataFileName('input/finicity_sophtron_7_6_2023.csv'),
    ...providers
  },
  output: {
    main: utils.resolveDataFileName('output/main', '.csv', true)
  }
}

const db = {
  current: {
    mainIndex: new Map(),
    foreignIndexes: new Map()
  },
  input: {

  }
}
for(let p in providers){
  db.current.foreignIndexes.set(p, new Map());
}

function populateEntryProperties(entry, s, sourceSchema, sourceId){
  let routing_number = s[sourceSchema['routing_number']];
  if(!entry.name || entry.id === sourceId){
    // entry may get updated, 
    entry.name = s[sourceSchema['name']];
    entry.url = s[sourceSchema['url']] || entry.url;
    entry.logo = s[sourceSchema['logo']] || entry.logo;
    entry.routing_number = routing_number || entry.routing_number;
  }
  entry.logo = entry.logo || s[sourceSchema['logo']];
  entry.routing_number = entry.routing_number || routing_number;
}
function processProvider(source, mapping, source_provider, mapped_provider, sourceSchema, mappingSchema){
  let start = new Date();
  logger.info(`Processing provider data: ${source_provider}, ${source.length}, to ${mapped_provider}`)
  for(let i = 1; i < source.length; i++){
    let s = source[i];
    let sourceId = s[sourceSchema['id']];
    //let log = s[sourceSchema['name']].toLowerCase() === 'pnc bank' && (mapped_provider === 'mx' || source_provider === 'mx')
    
    // find the mapping if exists
    let mappedId = mapped_provider ? mapping.find(item => 
        item[mappingSchema[source_provider]] === sourceId)?.[mappingSchema[mapped_provider]] : null ;
  
    // let log = sourceId === 'citibank'
    // if(log){
    //   console.log(mappedId)
    //   console.log(mappingSchema[source_provider], mappingSchema[mapped_provider])
    //   console.log(mapping.find(item => item[1] === 'citibank'))
    // }

    if(!db.current.foreignIndexes.get(source_provider).has(sourceId)){
      db.current.foreignIndexes.get(source_provider).set(sourceId, []);
    }
    if(mappedId && !db.current.foreignIndexes.get(mapped_provider).has(mappedId)){
      db.current.foreignIndexes.get(mapped_provider).set(mappedId, []);
    }
    let matched = false;
    for(let en of db.current.foreignIndexes.get(source_provider)?.get(sourceId) || []){
      populateEntryProperties(en, s, sourceSchema, sourceId);
      if(mappedId){
        if(!en.foreignKeys[mapped_provider]){
          en.foreignKeys[mapped_provider] = mappedId;
          db.current.foreignIndexes.get(mapped_provider).get(mappedId).push(en);
          matched = true;
        }else if(en.foreignKeys[mapped_provider] === mappedId){
          matched = true;
        }
      }
    }
    if(mappedId){
      for(let en of db.current.foreignIndexes.get(mapped_provider)?.get(mappedId) || []){
        if(!en.foreignKeys[source_provider]){
          populateEntryProperties(en, s, sourceSchema, sourceId);
          en.foreignKeys[source_provider] = sourceId;
          db.current.foreignIndexes.get(source_provider).get(sourceId).push(en);
          matched = true;
        }else if(en.foreignKeys[source_provider] === sourceId){
          matched = true;
        }
      }
    }
    if(matched){
      continue;
    }
    // take the current provider used id as the universal Id, first come first serve
    // if no other providers to map, make the universal id specific
    let uid = mapped_provider ? sourceId: `${source_provider}_${sourceId}`;
    let entry = {
      id: uid,
      foreignKeys: {
        [source_provider]: sourceId,
        [mapped_provider]: mappedId,
      }
    };
    populateEntryProperties(entry, s, sourceSchema, sourceId);
    db.current.mainIndex.set(uid, entry)
    // ensure foreign index so that this can be found later 
    db.current.foreignIndexes.get(source_provider).get(sourceId).push(entry);
    if(mappedId){
      db.current.foreignIndexes.get(mapped_provider).get(mappedId).push(entry);
    }
  }
  logger.info(`Processed provider data: ${source_provider} to ${mapped_provider}, took ${(new Date() - start)/1000} seconds`)
}

(async function entry(){
  let start = new Date();
  function elapsedSeconds(){
    return (new Date() - start) / 1000;
  }
  for(let [key, file_name] of Object.entries(file_names.input)){
    db.input[key] = await utils.processCsvFile(file_name);
  }

  logger.info(`${elapsedSeconds()}s: Pre-processing finicity data`)
  for(let map of db.input.finicity_sophtron){
    map[finicity_sophtron_schema.sophtron] = map[finicity_sophtron_schema.sophtron].toLowerCase()
  }
  logDb();
  // Load existing mainIndex from file for deltas, may speed things up? 
  // un finished code
  // let main = await utils.processCsvFile(file_names.output.main);
  // db.current.mainIndex = main.reduce((sum, item) => {
  //   let entry = {};
  //   for(let i = 0; i < mainIndexSchema.length - 1; i++){
  //     // make an main index entry
  //     entry[mainIndexSchema[i]] = item[i];
  //   }
  //   let foreignKeys = item[mainIndexSchema.length - 1].split(';');
  //   entry.foreignKeys = {}
  //   //loop through provider list and save foreignkeys by provider name if exists
  //   for(let i = 0; i < providers.length; i++){
  //     let providerName = providers[i];
  //     // save foreign key value to entry
  //     entry.foreignKeys[providerName] = foreignKeys[i];
  //     if(foreignKeys[i]){
  //       // index the foreign key for later lookup
  //       if(!db.current.foreignIndexes.get(providerName).has(foreignKeys[i])){
  //         // there could by many to many mappings, the foreignKey index is not unique
  //         db.current.foreignIndexes.get(providerName).set(foreignKeys[i], [])
  //       }
  //       db.current.foreignIndexes.get(providerName].get(foreignKeys[i]).push(obj);
  //     }
  //   }
  //   sum.set(entry.id, entry);
  //   return sum;
  // }, new Map())
  logger.info(`${elapsedSeconds()}s: Output:`)

  // add the test list first, as they won't have any mappings to others 
  // leaving the mapped_provider as '' will ensure the universal id generated provider specific, e.g. have a prefix as <provider>_
  processProvider(db.input.mx_int, [], 'mx_int', '', defaultSourceDataSchema, {})
  processProvider(db.input.akoya_sandbox, [], 'akoya_sandbox', '', defaultSourceDataSchema, {})
  processProvider(db.input.finicity_sandbox, [], 'finicity_sandbox', '', defaultSourceDataSchema, {})

  //Process mx first, this will take mx institution id as the universal id generated, so long as mx mapping data is availabel
  processProvider(db.input.mx, db.input.mx_sophtron, 'mx', 'sophtron', defaultSourceDataSchema, mx_sophtron_schema)
  processProvider(db.input.mx, db.input.akoya_mx, 'mx', 'akoya', defaultSourceDataSchema, akoya_mx_schema)
  
  //because the data may have many-to-many cases, process sophtron with double checking mx mapping
  processProvider(db.input.sophtron, db.input.mx_sophtron, 'sophtron', 'mx', defaultSourceDataSchema,mx_sophtron_schema)
  processProvider(db.input.akoya, db.input.akoya_sophtron, 'akoya', 'sophtron', defaultSourceDataSchema, akoya_sophtron_schema)
  //Currently we have a finicity mapping to sophtron data but not to mx, hence this must happen after all mx and sophtron data are processed
  processProvider(db.input.finicity, db.input.finicity_sophtron, 'finicity', 'sophtron', defaultSourceDataSchema, finicity_sophtron_schema)
  
  const file_name = utils.resolveDataFileName('output/main', '.csv', false);
  logger.info(`${elapsedSeconds()}s: Saving to file: ${file_name}`)
  var fwriter = fs.createWriteStream(file_name, {
    flags: 'w' // a: append, w: write
  })
  fwriter.write(`uid,name,url,logo,foreignKeys(${Object.keys(providers).join(';')}),routing_number`)
  for(let [key, item] of db.current.mainIndex){
    if(item.name){
      fwriter.write(`\n${key},${item.name.replaceAll(',', config.CsvEscape)},${item.url||''},${item.logo||''},${Object.keys(providers).map(p => `${item.foreignKeys[p] || ''}`).join(';')},${item.routing_number||''}`)
    }else{
      logger.error(`Invalid item`, item)
    }
  }
  logger.info(`${elapsedSeconds()}s: Done, ${db.current.mainIndex.size} items`)
})()