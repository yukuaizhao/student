var express = require('express')
const User = require('./user.js').user
const Stu = require('./user.js').stu
var router = express.Router()
//退出账号
router.get('/logout',function(req,res){
  req.session.username=null
  res.redirect('/')
})
//访问首页
router.get('/',function(req,res){
  res.render('index.html')
})
//编辑学生信息路径
router.get('/edit',function(req,res){
  Stu.findOne(req.query,function(err,data){
    if (err) {
      console.log('查询失败')
    }
    res.render('edit.html',{
      student:data
    })
    console.log(data)
  })
})
router.post('/edit',function(req,res){
  var body = req.body
  var values=Object.values(body)
  var arry = values.some(function(item){
    return item ===''
  })
  if (arry === true) {
    return res.status(200).json({
      code_id: 0,
      message: 'mes can not null'
    })
  }
  body._id=body._id.replace(/"/g,'')
  Stu.findByIdAndUpdate(body._id,
    {
      stuNum:body.stuNum,
      stuName:body.stuName,
      stuAge:body.stuAge,
      stuPhone:body.stuPhone
    },function(err){
    if (err) {
      return res.status(500).json({
        code_id: 500,
        message: 'error'
      })
    }
    return res.status(200).json({
      code_id: 1,
      message: 'mes can not null'
    })
  })
})
//删除学生信息
router.get('/del',function(req,res){
  
  Stu.findOneAndRemove(req.query,function(err){
    if (err) {
     console.log('删除失败')
    }
    console.log('删除成功')
    res.redirect('/stu')
  })
})
//添加学生信息
router.get('/addstu', function (req, res) {
  res.render('addstu.html')
})
router.post('/addstu', async function (req, res) {
  var body = req.body
  
  try {
    if (await Stu.findOne({ stuNum: body.stuNum })) {
      return res.status(200).json({
        code_id: 0,
        mes: 'stu exit'
      })
    }
    var values=Object.values(body)
    var arrys=values.some(function(item){
      return item === ''
    })
    if (arrys===true) {
      return res.status(200).json({
        code_id: 2,
        message: 'mes can not null'
      })
    }
    var newStu = new Stu(body)
    newStu.save(function(error,admin){
      if (error) {
        return res.status(500).json({
          code_id: 500,
          message: 'server error'
        })
      }
      return res.status(200).json({
        code_id: 1,
        message: 'save success'
      })
    })
    

  } catch (error) {
    return res.status(500).json({
      code_id: 500,
      message: 'server error'
    })
  }


})
//进入学生信息管理页面
router.get('/stu', function (req, res) {
  
  console.log(req.session.username)
  const stu1 = new Stu({
    stuNum: 1,
    stuName: '傻帽',
    stuAge: 24,
    stuPhone: '15515162557'
  })
  /* stu1.save(function(err,admin){
    if (err) {
      return console.error(err);
    }
    console.log('保持成功')
  }) */
  Stu.find({}, function (err, data) {
    // console.log(data)
    res.render('stu.html', {
      students: data,
      username:req.session.user.username,
      mes:req.session.mes
    })
  })
})
//登录路径
router.get('/login', function (req, res) {
  
  res.render('login.html')
})
router.post('/login', function (req, res) {
  let body = req.body
  User.findOne(body, function (err, data) {
    if (err) {
      return res.status(500).json({
        code_id: 500,
        mes: 'error '
      })
    }
    if (data) {
      req.session.user=body
      req.session.mes='当前账号：'
      req.session.login=true
      return res.status(200).json({
        code_id: 1,
        mes: 'login success'
      })
    }
    res.status(200).json({
      code_id: 0,
      mes: 'login error'
    })

  })
})
//注册路径
router.get('/register', function (req, res) {
  res.render('register.html')
})
router.post('/register', async function (req, res) {
  let body = req.body
  let values = Object.values(body)
  let arry = values.some(function(item){
    return item === ''
  })
  if (arry === true) {
    return res.status(200).json({
      code_id: 3,
      message: 'can not null'
    })
  }
  if (values[1]!==values[2]) {
    return res.status(200).json({
      code_id: 2,
      message: 'rpwd != pwd'
    })
  }
  try {
    if (await User.findOne({ username: body.username })) {
      return res.status(200).json({
        code_id: 1,
        message: 'username already exit'
      })
    }
    const admin = new User({
      username: body.username,
      password: body.password
    })
    admin.save(function (err, admin) {
      if (err) {
        return res.status(500).json({
          code_id: 500,
          message: 'server error'
        })
      }
      res.status(200).json({
        code_id: 0
      })
    })
  } catch (error) {
    return res.status(500).json({
      code_id: 500,
      message: 'server error'
    })
  }

})
module.exports = router