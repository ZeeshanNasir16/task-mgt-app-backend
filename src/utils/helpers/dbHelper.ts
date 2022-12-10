const mongoose = require('mongoose');
const constants = require('../constants');

const validateObjectId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid id');
  }
};

export default validateObjectId;
