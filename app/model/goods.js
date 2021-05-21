'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const goodsSchema = new Schema({
    // goodsId: {
    //   type: String,
    // },
    userId: {
      type: String,
    },
    goodsName: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    schoolName: {
      type: String,
    },
    typeName: {
      type: String,
    },
    images: {
      type: Array,
    },
    num: {
      type: Number,
    },
    createTime: {
      type: String,
    },
    status: {
      type   : Number,
      default: 1,
      comment: '0 表示已删除，1表示刚发布待审核，2表示审核通过，3表示审核未通过',
    },
    reviewId: {
      type: String,
      comment: '对应审核记录的id'
    }
  });
  return mongoose.model('Goods', goodsSchema);
};

