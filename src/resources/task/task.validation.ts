import Joi, { string } from 'joi';
import userResp from '@/resources/user/user.validation';

const addNewTask = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required(),
  deadLine: Joi.date().required(),
  status: Joi.string().default('todo'),
  assignedTo: Joi.object({
    user: Joi.string(),
    date: Joi.date(),
  }),
  assignedBy: Joi.string().required(),
  check: Joi.string(),
  project: Joi.string().required(),
});

const updateTask = Joi.object({
  title: Joi.string().min(5),
  description: Joi.string(),
  startDate: Joi.date(),
  deadlineDate: Joi.date(),
  status: Joi.string(),
  assignedTo: Joi.object({
    user: Joi.string(),
    date: Joi.date(),
  }),
  project: Joi.string(),
});

export default { addNewTask, updateTask };
