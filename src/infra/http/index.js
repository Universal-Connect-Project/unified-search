const config = require('../../server/config');
const real = require('./real');
const mocked = require('./mock');

const mock = config.Env === 'mocked';

const http = mock ? mocked : real;

module.exports = http;
