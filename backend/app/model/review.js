'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const reviewSchema = new Schema({
    goodsId: {
      type    : String,
      required: true,
    },
    createTime: {
      type    : String,
      required: true,
    },
    reason: {
      type: String,
    },

    // 修改后状态，0 为删除，1为刚发表(待审核), 2为审核通过，3为审核不通过
    status: {
      type: Number,
    }
  });
  return mongoose.model('Review', reviewSchema);
};
