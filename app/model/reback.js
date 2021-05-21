'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const rebackSchema = new Schema({
    context: {
      type    : String,
      required: true,
    },
    createTime: {
      type    : String,
      required: true,
    },
    email: {
      type   : String,
      default: '未登录用户'
    }

  });
  return mongoose.model('Reback', rebackSchema);
};
