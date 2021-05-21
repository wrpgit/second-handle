'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const commonSchema = new Schema({
    schools: [
      { type: String }
    ],
    navbars: [
      { type: String }
    ],
  });
  return mongoose.model('Common', commonSchema);
};
