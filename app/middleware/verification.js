'use strict';

// 验证是否登陆
module.exports = () => {
  return async function verification(ctx, next) {
    const userInfo = ctx.session.userInfo;
    if (!userInfo) {
      ctx.body = { code: 10, msg: '未登录，请先登陆' };
      return;
    }
    await next();
  };
};
