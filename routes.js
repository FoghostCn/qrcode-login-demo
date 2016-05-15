'use strict';

const router = require('koa-router')();
const controllers = require('./controllers');

router.get('/', controllers.auth.toLogin);
router.post('/authorize', controllers.auth.authorize);

router.use('/other-services', controllers.auth.needLogin);

router.all('*', function* notFound() { this.throw(404); });
module.exports = router.routes();