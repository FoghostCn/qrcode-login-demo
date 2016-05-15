'use strict';

const redis = require('redis');
const co = require('co');
const cookie = require('cookie');
//const httpApi = require('./http_api.js');
const redisStore = exports.sessionStore = require('koa-redis')(config.redis);
const utils = require('../utils');
const EventEmitter = require('events');

const CHANNEL = 'qrcode-login';

const adapter = new EventEmitter();
//const adapter = new RedisAdapter();

exports.pubAuthorize = function (msg) {
  adapter.emit(CHANNEL, msg);
};

exports.subAuthorize = function (io) {
  adapter.on(CHANNEL, msg => {
    co(function *() {
      const socket = io.sockets.connected[msg.sid];
      if (socket) {
        let session = socket.session;
        if(!session) return socket.emit('session_expired');
        //session.user = yield httpApi.getUserInfo(msg.userId);
        session.user = {userId: utils.uuid.gen()};
        yield setSession(socket.sessionId, session);
        socket.emit('authorized');
      }
    }).catch(utils.log.error);
  });
};

function getSession(socket) {
  return co(function *() {
    if(!socket.handshake.headers.cookie) return ;
    let sessionId = config.session.prefix + cookie.parse(socket.handshake.headers.cookie)[config.session.key];
    let session = yield redisStore.get(sessionId);
    if (!session) {
      return ;
    }
    socket.sessionId = sessionId;
    socket.session = session;
    return session;
  });
}

function setSession(key, session) {
  return redisStore.set(key, session, config.session.ttl);
}

exports.ifAutoLogin = function (socket) {
  co(function *() {
    let session = yield getSession(socket);
    if (session && session.user) {
      socket.emit('authorized');
      yield setSession(socket.sessionId, session, config.session.ttl);//更新过期时间
    } else {
      socket.emit('unauthorized');
    }
    console.log('connection in');
    socket.on('error', utils.log.error);
    socket.on('disconnect', () => {
      utils.log.debug('socket disconnect sid: %s', socket.id);
    })
  }).catch(utils.log.error);
};

class RedisAdapter {

  constructor(){
    this.pubLoginRedis = redis.createClient.apply(null, config.redis);
    this.subLoginRedis = redis.createClient.apply(null, config.redis);
    [this.pubLoginRedis, this.subLoginRedis].forEach(r => {r.on('error', utils.log.error);});
  }

  emit(channel, msg){
    this.pubLoginRedis.publish(channel, JSON.stringify(msg));
  }

  on(channel, fn) {
    this.subLoginRedis.subscribe(channel);
    this.subLoginRedis.on('message', (c, msg) => {
      if(channel === c) {
        fn(JSON.parse(msg));
      }
    })
  }
}