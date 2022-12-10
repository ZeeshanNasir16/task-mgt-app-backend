import Joi from 'joi';

const addNewProject = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  deadlineDate: Joi.date().required(),
  status: Joi.string().default('incompleted'),
  assignedTo: Joi.string().required(),
});

const updateProject = Joi.object({
  title: Joi.string().min(5),
  description: Joi.string(),
  startDate: Joi.date(),
  deadlineDate: Joi.date(),
  status: Joi.string(),
  assignedTo: Joi.string(),
});

export default { addNewProject, updateProject };
