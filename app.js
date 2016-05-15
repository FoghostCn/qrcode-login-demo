'use strict';

const app = module.exports = require('koa')();
const config = require('./config');
global.config = config;
const bodyParser = require('koa-bodyparser');
const utils = require('./utils');
const routes = require('./routes.js');
const auth = require('./services').auth;
const path = require('path');
const session = require('koa-generic-session');
const mount = require('koa-mount');
const staticServer = require('koa-static');
const socketIo = require('socket.io');
const socketIoRedis = require('socket.io-redis');
app.keys = config.session.secret;

// Logger
app.use(function *(next) {
  const start = Date.now();
  try {
    yield next;
    this.status = this.status != 404 ? this.status : 200;
  } catch (e) {
    this.status = e.status || 500;
    this.app.emit('error', e, this);
  } finally {
    const ms = Date.now() - start;
    utils.log.debug(`${this.method} ${this.url} ${ms}ms` );
  }
});

app.use(mount('/public', staticServer(
  path.join(config.rootPath, 'public'), {maxage: config.staticServerMaxAge})));
app.use(session({
  store: auth.sessionStore,
  key: config.session.key,
  prefix: config.session.prefix
}));
app.use(bodyParser());
app.use(routes);
app.on('error', utils.log.error);
process.on('uncaughtException', utils.log.error);
const server = app.listen(config.port, () => {
  utils.log.debug(`listening on port ${config.port} in ${config.isProduction ?
    'production' : 'debug'} mode`);
});

const io = socketIo(server, {adapter: socketIoRedis(config.redis)});
auth.subAuthorize(io);
io.on('connect', auth.ifAutoLogin);
server.on('error', e => {throw e});