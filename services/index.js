'use strict';

const fs = require('fs');
const _ = require('lodash');

const excludeFile = ['index.js'];

fs.readdirSync(__dirname).forEach(file => {
  if(!~excludeFile.indexOf(file) && !_.startsWith(file, '.') && _.endsWith(file, '.js')) {
    const moduleName = _.camelCase(file.substr(0, file.lastIndexOf('.')));
    exports[moduleName] = require('./' + file);
  }
});
