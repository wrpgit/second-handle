'use strict';
// app/io/middlewware/auth.js
// 这个中间件的作用是提示用户连接与断开的，连接成功的消息发送到客户端，断开连接的消息在服务端打印
module.exports = app => {

  return async (ctx, next) => {
    const { socket, session } = ctx;
    // 获取客户端ID

    if (!session.userInfo) {
      // console.log('还未登陆，请先登陆');
      socket.disconnect();
      return;
    }

    // 将用户id和socketId 的映射存入redis
    // 最大过期时长，兜底用
    const MAX_TTL = 24 * 60 * 60;
    const key = `socketId:${ctx.session.userInfo.userId}`;

    await app.redis.pipeline()
      .set(key, ctx.socket.id, 'EX', MAX_TTL)
      .del(`silent:${session.userInfo.email}`)
      .del(`notReadMessageNum:${session.userInfo.email}`)
      .exec();

    await next();
  };
};
