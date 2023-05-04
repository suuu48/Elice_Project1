const Joi = require('joi');

const UserJoiSchema = Joi.object({ // TODO: 객체 이름은 카멜케이스로!
  email: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  roleType: Joi.boolean().default(true).required(),
  authorization: Joi.string().required(),
});

module.exports = UserJoiSchema;
