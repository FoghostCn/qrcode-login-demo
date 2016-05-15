'use strict';

const pkg = require('./../package.json');

let config = {
  debug: true,
  port: 3000,
  rootPath: __dirname + '/../',
  isProduction: process.env.NODE_ENV === 'production',
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0
  },
  session: {
    key: pkg.name,
    prefix: pkg.name + ':',
    secret: pkg.name.split('-'),
    ttl: 24 * 60 * 60 * 1000 * 3//一天
  },
  redisChannel: pkg.name,
  staticServerMaxAge: 0,
  authWhiteList: [
    '127.0.0.1',
    '1'
  ]
};

try {
  const local = require('./local.js');
  const _extend = require('util')._extend;
  config = _extend(config, local);
} catch(e) {}
module.exports = config;