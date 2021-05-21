'use strict';

const _ = require('lodash');
const Service = require('egg').Service;
const bcrypt = require('bcrypt');

class UserService extends Service {
  async getUserInfo(userId) {
    const { ctx } = this;
    // const user = await ctx.model.User.findOne({ userId });
    const user = await ctx.model.User.findOne({ userId }, { avatarUrl: 1, nickName: 1, userId: 1, userSchool: 1, isEmailRemind: 1});
    return user;
  }

  async signup(email, password, userSchool, nickName, avatarUrl, code) {
    const { ctx, app } = this;
    const [ [,rightCode], [,times] ] = await this.app.redis.pipeline()
      .get(`verificationCode:${email}`)
      .incr(`verificationCodeTimes:${email}`)
      .exec();
    if (!rightCode) {
      ctx.body = { code: 199, msg: '验证码已失效，请重新发送' };
      return;
    }
    if (rightCode !== code) {
      if (Number(times) > 10) {
        ctx.body = { code: 198, msg: '尝试的次数过多，请10分钟后重新发送验证码' };
        return;
      }
      ctx.body = { code: 197, msg: '验证码错误' };
      return;
    }
    const userId = await this.generateUserId();
    await ctx.model.User.create({ email, userId, password, userSchool, nickName, avatarUrl });
    const user = { email, userId, userSchool, nickName, avatarUrl, isEmailRemind: true, isMakeOrderRemind: true };
    user.isAdmin = app.config.default.systemAdmin.includes(userId);
    await this.app.redis
      .pipeline()
      .del(`verificationCode:${email}`)
      .del(`verificationCodeTimes:${email}`)
      .exec();
    // 将用户信息存入session中
    ctx.session.userInfo = user;
    ctx.body = { code: 0, msg: '注册成功', user };
  }

  async changePassword(email, password, code) {
    const { ctx } = this;
    const [ [,rightCode], [,times] ] = await this.app.redis.pipeline()
      .get(`changePasswordCode:${email}`)
      .incr(`changePasswordCodeTimes:${email}`)
      .exec();

    if (!rightCode) {
      ctx.body = { code: 199, msg: '验证码已失效，请重新发送' };
      return;
    }
    if (rightCode !== code) {
      if (Number(times) > 10) {
        ctx.body = { code: 198, msg: '尝试的次数过多，请10分钟后重新发送验证码' };
        return;
      }
      ctx.body = { code: 197, msg: '验证码错误' };
      return;
    }

    const salt = bcrypt.genSaltSync(5);
    const passwordEncry = bcrypt.hashSync(password, salt);
    await ctx.model.User.updateOne({ email }, { password: passwordEncry });
    await this.app.redis.del(`changePasswordCode:${email}`);

    ctx.body = { code: 0, msg: '修改成功' };
  }

  async generateUserId() {
    while (true) {
      const numCode = Math.floor((Math.random()*10000000)+1);
      const userId = 'q' + numCode.toString().padStart(7,'1');
      const user = await this.ctx.model.User.findOne({ userId });
      if (!user) {
        return userId;
      }
    }
  }
}

module.exports = UserService;
