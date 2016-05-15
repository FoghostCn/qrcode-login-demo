'use strict';

const send = require('koa-send');
const utils = require('../utils');
const services = require('../services');

exports.needLogin = function *(next) {
  if (!this.session.user) {
    return this.redirect('/login');
  }
  yield next;
};

exports.toLogin = function *() {
  if (this.session.user) {
    return this.body = this.session.user;
  }
  this.session.user = null;//modify session otherwise will not generate session
  return yield send(this, 'index.html', {root: config.rootPath + '/public/' });
};

exports.authorize = function *() {
  const remoteIp = utils.ip.getIpv4(this.request.ip);
  console.log('remoteIp : ' + remoteIp);
  //if (~config.authWhiteList.indexOf(remoteIp)){
    return services.auth.pubAuthorize(this.request.body);
  //}
  //this.throw(401);
};

