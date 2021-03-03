var express = require('express');
var app = express();
var session = require('express-session')
var router = require('./router.js')
//利用body-parser中间件来获取post方式的查询值
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//开发静态资源，
//在浏览器中通过 /public/xxx/xxx来获取静态资源
app.use('/public/',express.static('./public'))
//配置session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
//挂载路由
app.use(router)
app.engine('html', require('express-art-template'));
app.listen('5000',function(){
  console.log('running')
})