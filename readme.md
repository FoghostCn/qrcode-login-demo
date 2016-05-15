# qrcode-login demo

a demo to show how to use EventEmitter or  redis pub/sub model to login with qrcode;

### guide
```
  $ git clone https://github.com/FoghostCn/qrcode-login-demo.git
  $ cd qrcode-login-demo
  $ npm i && npm run start
```
open http://localhost:3000/

you will see an qrcode ,then open the web browser console, copy the log just look like :

```
{
  "sid":"/#1e5Sp_vNcuIROeIMAAAA"
}
```

use postman or browser http request plugin send a post request to http://localhost:3000/authorize with the body yo have just copied ,you will see a redirect in the browser with a random userId in you session, of cause you should generate session by yourself in you project;

if you want to run in cluster mode,just change file `service/auth.js` line 13、14 to :

```
13  //const adapter = new EventEmitter();
14  const adapter = new RedisAdapter();
```


