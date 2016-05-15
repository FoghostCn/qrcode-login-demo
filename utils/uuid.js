"use strict";

const node_uuid = require('node-uuid');

exports.gen = function () {
  return node_uuid.v1().replace(/-/g, '');
};
