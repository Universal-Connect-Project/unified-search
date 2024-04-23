const finicityClient = require('../finicityClient')
const config = require('../config')
const utils = require('../../utils')

function filterInstitution (item) {
  return item[2].toLowerCase().indexOf('finbank') >= 0 ||
      item[4].toLowerCase().indexOf('finbank') > -1
}

async function getFinicityInstitutions () {
  const fileName = utils.resolveDataFileName('input/finicity_sophtron_7_6_2023.csv')
  const mapping = await utils.processCsvFile(fileName)
  utils.arrayToCsvFile(mapping.filter(filterInstitution), 'interim/finicity_sandbox', 'id,name,url,logo_url', (item) => `${item[0]},${item[2].trim().replaceAll(',', config.CsvEscape)},${item[4] || ''},${item[6] || ''}`)
  utils.arrayToCsvFile(mapping.filter((ins, index) => index !== 0 && !filterInstitution(ins)), 'interim/finicity', 'id,name,url,logo_url', (item) => `${item[0]},${item[2].trim().replaceAll(',', config.CsvEscape)},${item[4] || ''},${item[6] || ''}`)
}

getFinicityInstitutions()
