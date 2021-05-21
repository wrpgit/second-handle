'use strict';
// {app_root}/app/io/middleware/packet.js

module.exports = app => {
  return async (ctx, next) => {
    // 处理收到的消息
    const msg = ctx.packet;
    if (msg[0] === 'sendMsg') {
      const { receiverUserId, context } = msg[1];

      const key = `socketId:${receiverUserId}`;
      const receiverSocketId = await app.redis.get(key);
      const namespace = app.io.of('/');
      // 给发送者发回消息，说明发送成功
      // 将消息存入数据库
      await ctx.service.message.sendMessage(receiverUserId, context);
      namespace.sockets[ctx.socket.id].emit('reMessage', 'success');
      if (receiverSocketId) {
        namespace.sockets[receiverSocketId].emit('message', { createTime: '刚刚', context, receiverUserId, sendUserId: ctx.session.userInfo.userId });
      } else {
        // 没有在线，发邮件提醒
        const userInfo = await ctx.model.User.findOne({ userId: receiverUserId }, { email: 1, isEmailRemind: 1 });
        if (userInfo && userInfo.isEmailRemind) {
          const isSilent = await app.redis.get(`silent:${userInfo.email}`);
          if (isSilent) {
            // 处在沉默期
          } else {
            const [ [,res], [,notReadNum] ] = await app.redis.pipeline()
              .set(`silent:${userInfo.email}`, '77', 'EX', 60 * 60)
              .incr(`notReadMessageNum:${userInfo.email}`)
              .exec();
            await ctx.service.email.sendEmailNotice(notReadNum, userInfo.email);
          }
        }
      }
    }
    await next();
  };
};
