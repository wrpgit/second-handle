'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const messageListSchema = new Schema({
    context: {
      type   : String,
      required: true,
    },
    createTime: {
      type   : String,
      required: true,
    },

    /**
     * 对方的id
     */
    othersUserId: {
      type: String,
    },
    othersNickName: {
      type: String,
    },
    othersAvatar: {
      type: String,
    },
    notReadNum: {
      type   : Number,
      default: 0,
    },

    /**
     * 这条记录属于谁
     */
    belong: {
      type   : String,
      required: true,
    },
  });
  return mongoose.model('MessageList', messageListSchema);
};
