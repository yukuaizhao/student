const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true//不能为空
  },
  password: {
    type: String,
    required: true
  }
})

const stuSchema = new mongoose.Schema({
  stuNum: {
    type: String,
    required: true//不能为空
  },
  stuName: {
    type: String,
    required: true
  },
  stuAge: {
    type: String,
    required: true
  },
  stuPhone: {
    type: String,
    required: true
  }
})
const User = mongoose.model('User', userSchema)
const Stu = mongoose.model('Stu', stuSchema)
module.exports.user = User
module.exports.stu = Stu
