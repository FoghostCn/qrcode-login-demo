'use strict';

const nodemailer = require('nodemailer');
const pack = require('../package.json');

const smtpConfig = {
  host: 'smtp.xxx.com',
  port: 465,
  secure: true,
  // tls: {
  //   rejectUnauthorized: false
  // },
  auth: {
    user: 'xx@xxx.com',
    pass: 'xxxx'
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

exports.sendMail = function (title, content) {
  const mailOptions = {
    from: pack.name + '服务器报错通知', // sender address
    to: 'xxxx@xc.com,xxxxx@xx.com', // list of receivers
    subject: title, // Subject line
    html: content.replace(/\n/g, '</br>') // html body
  };

  transporter.sendMail(mailOptions, function(error){
    if(error){
      return console.log(error);
    }
  });
};