'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const orderSchema = new Schema({
    buyUserId: {
      type    : String,
      required: true,
    },
    sailUserId: {
      type    : String,
      required: true,
    },
    goodsId: {
      type    : String,
      required: true,
    },
    num: {
      type   : Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type   : Number,
      required: true,
    },
    orderStatus: {
      type   : Number,
      default: 1,
      comment: '0 为删除状态，1为待收货状态，2，3为已完成'
    },
    createTime: {
      type   : String,
      required: true,
    },
  });
  return mongoose.model('Order', orderSchema);
};

