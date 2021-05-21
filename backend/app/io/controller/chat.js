'use strict';

module.exports = app => {
  class ChatController extends app.Controller {

    /**
     * socket断开连接
     */
    async disconnect() {
      const { ctx } = this;
      // console.log('连接断开', ctx.session.userInfo.userId);

      // 清除redis中的 socketId
      const key = `socketId:${ctx.session.userInfo.userId}`;
      await app.redis.del(key);
    }
  }
  return ChatController;
};
