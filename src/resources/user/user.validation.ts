import Joi from 'joi';
import { Types } from 'mongoose';

const addNewEmployee = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required(),
  role: Joi.string().default('user'),
  address: Joi.string(),
});

const userResp = Joi.object({
  id: Joi.string().required(),
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  fullName: Joi.string(),
  role: Joi.string().default('user'),
  address: Joi.string(),
});

const updateUser = Joi.object({
  firstName: Joi.string().max(30),
  lastName: Joi.string().max(30),
  email: Joi.string().email(),
  address: Joi.string(),
});

export default { addNewEmployee, userResp, updateUser };
