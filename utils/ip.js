'use strict';

const os = require('os');

const interfaces = os.networkInterfaces();

let ipaddress ;

for (let i in interfaces) {
  for (let ip in interfaces[i]) {
    let address = interfaces[i][ip];
    if (address.family === 'IPv4' && !address.internal) {
      if (~['192', '10'].indexOf(address.address.substring(0,address.address.indexOf('.')))) {
        ipaddress = address.address;
      }
    }
  }
}

exports.getLocalIp = () => {
  if(ipaddress) {
    return ipaddress;
  }
  console.error(new Error('get ip addr failed'));
};

exports.getIpv4 = (remoteaddr) => {
  return remoteaddr && remoteaddr.substr(remoteaddr.lastIndexOf(':') + 1);
};