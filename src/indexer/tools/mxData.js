const mxClient = require('../mxClient')
const config = require('../config')
const utils = require('../../utils')

function filter_logo (item) {
  if (item.medium_logo_url !== 'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/default_100x100.png') {
    return item.medium_logo_url
  }
  if (item.small_logo_url !== 'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/default_50x50.png') {
    return item.small_logo_url
  }
  return ''
}

async function entry () {
  const header = 'code,name,url,medium_logo_url'
  const row = (item) => `${item.code},${item.name.trim().replaceAll(',', config.CsvEscape)},${item.url},${filter_logo(item)}`

  const mxInt = await mxClient.batchLoadInstitutions('int')
  utils.arrayToCsvFile(mxInt.filter(b => b.code !== 'amex' && b.code !== 'citibank'), 'interim/mx_int', header, row)
  const prod = await mxClient.batchLoadInstitutions('prod')
  utils.arrayToCsvFile(prod.filter(b => !b.name.toLowerCase().startsWith('finbank')), 'interim/mx', header, row)

  const mx_sophtronFile = utils.resolveDataFileName('input/20230309_mx_institutions_sophtron_g374.csv')
  const mx_sophtron = await utils.processCsvFile(mx_sophtronFile)
  mx_sophtron.shift()

  for (const map of mx_sophtron) {
    // mx mapping used internal institution guid that's not accessible from public api, update the mapping first
    const platform = prod.find(item => item.name.trim() === map[1])
    if (platform) {
      map[2] = platform.code
    }
  }
  utils.arrayToCsvFile(mx_sophtron, 'interim/mx_sophtron', 'name,mx,sophtron', row => (`${row[1]},${row[2]},${row[3]}`))
}

entry()
