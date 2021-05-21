'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const messageSchema = new Schema({
    // 使用mongoDB 自动生成的_id 作为唯一标识
    // msgId: {
    //   type   : String,
    //   required: true,
    // },
    context: {
      type   : String,
      required: true,
    },
    createTime: {
      type   : String,
      required: true,
    },
    sendUserId: {
      type: String,
    },
    receiveUserId: {
      type: String,
    },
    belong: {
      type    : String,
      comments: '这条消息属于谁，一条消息创建两条记录，发送者一条，接收者一条',
    },
  });
  return mongoose.model('Message', messageSchema);
};
