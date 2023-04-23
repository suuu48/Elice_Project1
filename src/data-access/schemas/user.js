const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  roleType: {
    //회원 종류( 관리자 : 0/ 회원 : 1)
    type: Boolean,
    default: 1,
  },
});

module.exports = userSchema;
