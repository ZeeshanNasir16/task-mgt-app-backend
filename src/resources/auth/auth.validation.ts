import Joi from 'joi';

const Login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// ! testing purposes
const Admin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
  role: Joi.string().required(),
});

export default { Login, Admin };
