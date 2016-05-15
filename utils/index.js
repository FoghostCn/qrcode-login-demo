'use strict';

exports.ip = require('./ip.js');
//exports.mail = require('./mail.js');
exports.uuid = require('./uuid.js');
exports.noop = () => {};
exports.log = {debug: console.log, error: function(e){
  console.error(e.stack);
}};
