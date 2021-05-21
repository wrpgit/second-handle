'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class UserController extends Controller {

  async signup() {
    const { ctx } = this;

    const rules = {
      email: { type: 'string', required: true },
      password: { type: 'string', required: true },
      userSchool: { type: 'string', required: true },
      nickName: { type: 'string', required: true },
      avatarUrl: { type: 'string', required: true },
      code: { type: 'string', required: true },
    }
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { email, password, userSchool, nickName, avatarUrl, code } = ctx.request.body;
    const isExist = await ctx.model.User.findOne({ email });
    if (isExist) {
      ctx.body = { code: 1, msg: '该用户已经注册, 请直接登陆' };
      return;
    }
    await ctx.service.user.signup(email, password, userSchool, nickName, avatarUrl, code);
  }

  async login() {
    const { ctx, app } = this;
    const rules = {
      userId: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }
    const errors = app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { userId, password } = ctx.request.body;
    const user = await ctx.model.User.findOne({ $or: [{ email: userId }, { userId }] });
    if (user) {
      const isMatch = await user.comparePassword(password);
      const filterUser = _.pick(user, ['email', 'avatarUrl', 'nickName', 'userId', 'userSchool', 'isEmailRemind', 'isMakeOrderRemind']);
      filterUser.isAdmin = app.config.default.systemAdmin.includes(userId);
      if (isMatch) {
        // 将用户信息存进session中
        ctx.session.userInfo = filterUser;
        ctx.body = { code: 0, msg: '登陆成功', user: filterUser };
        return;
      }
    }
    ctx.body = { code: 1, msg: '账号或密码错误' };
  }

  // 修改密码
  async changePassword() {
    const { ctx } = this;
    const rules = {
      email: { type: 'string', required: true },
      password: { type: 'string', required: true },
      code: { type: 'string', required: true },
    }
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { email, password, code } = ctx.request.body;
    await ctx.service.user.changePassword(email, password, code);
  }

  async changeInfo() {
    const { ctx } = this;

    const rules = {
      userSchool: { type: 'string', required: true },
    }
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { nickName, userSchool } = ctx.request.body;
    if (nickName === "") {
      await ctx.model.User.updateOne({ userId: ctx.session.userInfo.userId }, { userSchool });
    } else {
      await ctx.model.User.updateOne({ userId: ctx.session.userInfo.userId }, { nickName, userSchool });
      ctx.session.userInfo.userSchool = userSchool;
    }
    ctx.body = { code: 0, msg: 'success' };
  }

  async loginout() {
    const key = `socketId:${this.ctx.session.userInfo.userId}`;
    await this.app.redis.del(key);
    this.ctx.session.userInfo = null;
    this.ctx.body = { code: 200, msg: 'success' };
  }

  async info() {
    const { ctx } = this;
    const rules = {
      userId: { type: 'string', required: true },
    }
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { userId } = ctx.query;
    const userInfo = await ctx.service.user.getUserInfo(userId);
    ctx.body = { code: 200, userInfo };
  }
}
module.exports = UserController;
