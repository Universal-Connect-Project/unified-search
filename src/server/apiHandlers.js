const getProviders = function (req, res) {
  res.send(['sophtron', 'mx', 'finicity', 'akoya'])
}

const handlePing = function (req, res) {
  res.sendStatus(200)
}

module.exports = {
  getProviders,
  handlePing
}