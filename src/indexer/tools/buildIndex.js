const logger = require('../../infra/logger')
const { buildIndex, serializeIndex, deserializeIndexRow } = require('./indexer')
const utils = require('../../utils')
const fs = require('fs')

const mainInput = utils.resolveDataFileName('output/main', '.csv', false)
const indexOutput = utils.resolveDataFileName('output/index', '.txt', false)
const ret = (async function entry () {
  const main = await utils.processCsvFile(mainInput)
  const mainIndex = buildIndex(main)
  logger.info(`Writing output: ${indexOutput}`)
  const fwriter = fs.createWriteStream(indexOutput, {
    flags: 'w' // a: append, w: write
  })
  for (const item of serializeIndex(mainIndex)) {
    fwriter.write('\n')
    fwriter.write(item)
  }
})()
