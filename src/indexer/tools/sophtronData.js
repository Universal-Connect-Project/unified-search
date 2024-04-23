const sophtronClient = require('../sophtronClient');
const utils = require('../../utils')
const config = require('../config');

const blackList = [
  '480d0c7f-3541-4587-acd6-5992788258bd',
  '5b4c8ebe-aa4a-4ae3-8736-ac4c109657ac', //Wells fargo bank / no logo
  'd06b4cb4-d11f-47cf-92bd-6d0fe52760b1', //USAA
  'b2a957e5-7bf2-47c0-bd63-ce96736cdacd'  //Chase bank
]

function filterInstitution(item){
  let name = item.InstitutionName.trim().toLowerCase();
  return !name.endsWith('v2')
    && !name.startsWith('test')
    && !name.endsWith('test')
    && !name.startsWith('dummy')
    && !name.startsWith('finbank')
    && !name.endsWith('dummy')
    && name !== 'corporation'
    && name !== 'neobanxdev'
    && name !== 'bank of americal'
    && name !== 'AAA bank of america'
    && name.indexOf('(test)') === -1
    && name.indexOf('test ') === -1
    && item?.URL !== 'testurl.com'
    && blackList.indexOf( item.InstitutionID ) === -1
}

sophtronClient.batchGetInstitutions().then(all => {
  utils.arrayToCsvFile(
    all.filter(filterInstitution), 
    'interim/sophtron',
    'id,name,url,logo_url,routing_number', 
    (item) => {
      let routing_number = `${item.InstitutionDetail.RoutingNumber}/${item.InstitutionDetail.MultipleRoutingNumbers}`.trim();
      let arr = routing_number.split('/').filter((r,i,a) => a.indexOf(r) === i)
      return `${item.InstitutionID},${item.InstitutionName.trim().replaceAll(',', config.CsvEscape)},${item.URL?.trim() || ''},${item.Logo?.trim() ||''},${arr.join(';')}`
    })
});