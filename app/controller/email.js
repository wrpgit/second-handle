'use strict';

const Controller = require('egg').Controller;

class EmailController extends Controller {

  // 注册时的验证码
  async verificationCode() {
    const { ctx } = this;
    const rules = {
      email: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { email } = ctx.request.body;
    //检验邮件是否合法
    const isLegel = await ctx.service.email.checkEmail(email);
    if (!isLegel) {
      ctx.body = { code: 180, msg:'邮箱格式不正确 '};
      return;
    }
    const code = await this.generateCode();
    const html = `
      <div>尊敬的用户, 您好：<div>
        <p>欢迎注册<a href="www.wrpxcx.com/second">大学生闲置物品交易平台</a>, 您的验证码为<b>${code}</b>(请勿告诉他人，10分钟内有效), 如果这不是您所希望收到的邮件，请忽略。</p>
        <p>您有什么建议可以直接联系此邮箱，或在平台中的反馈渠道进行反馈</p>
        
        <p>\n</p>
        <p></p>
        <p></p>
        <p>再次感谢!</p>
        <p>大学生闲置物品交易平台开发者</p>
    `;

    const res = await this.app.redis.get(`verificationCode:${email}`)
    if (res) {
      // console.log('已经发送过，还没过期');
      ctx.body = { code: 200, msg: '请勿重复发送' };
      return;
    }
    // 发送邮件
    const isSend = await ctx.service.email.sendMail(email, '验证码', html);
    // await this.app.redis.set(`verificationCode:${to}`, code, 10 * 60);
    await this.app.redis
      .pipeline()
      .set(`verificationCode:${email}`, code, 'EX', 10 * 60)
      .set(`verificationCodeTimes:${email}`, 0, 'EX', 10 * 60)
      .exec();
    if (isSend) {
      ctx.body = { code: 200, msg: '发送成功' };
      return;
    }
      ctx.body = { code: 1, msg: '发送失败' };
  }


  // 修改密码时的验证码
  async changePasswordCode() {
    const { ctx } = this;
    const rules = {
      email: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { email } = ctx.request.body;
    //检验邮件是否合法
    const isLegel = await ctx.service.email.checkEmail(email);
    if (!isLegel) {
      ctx.body = { code: 180, msg:'邮箱格式不正确 '};
      return;
    }
    const isSignUp = await ctx.model.User.findOne({ email });
    if (!isSignUp) {
      ctx.body = { code: 179, msg:'该邮箱还没有注册' };
      return;
    }
    const code = await this.generateCode();
    const html = `
      <a href="www.wrpxcx.com/second">from: 大学生闲置物品交易平台</a>
      <div>尊敬的用户, 您好：<div>
        <p>您正在进行修改密码操作，您的验证码为<b>${code}</b>(请勿告诉他人，10分钟内有效), 如果这不是您所希望收到的邮件，请忽略。</p>
        <p>您有什么建议可以直接联系此邮箱，或在平台中的反馈渠道进行反馈</p>
        
        <p>\n</p>
        <p></p>
        <p></p>
        <p>感谢您的使用!</p>
        <p>大学生闲置物品交易平台开发者</p>
    `;

    const res = await this.app.redis.get(`changePasswordCode:${email}`)
    if (res) {
      // console.log('已经发送过，还没过期');
      ctx.body = { code: 200, msg: '请勿重复发送' };
      return;
    }
    // 发送邮件
    const isSend = await ctx.service.email.sendMail(email, '修改密码', html);
    // await this.app.redis.set(`verificationCode:${to}`, code, 10 * 60);
    await this.app.redis
      .pipeline()
      .set(`changePasswordCode:${email}`, code, 'EX', 10 * 60)
      .set(`changePasswordCodeTimes:${email}`, 0, 'EX', 10 * 60)
      .exec();
    if (isSend) {
      ctx.body = { code: 200, msg: '发送成功' };
      return;
    }
      ctx.body = { code: 1, msg: '发送失败' };
  }



  // 修改是否需要邮件提醒
  async changeSubscribe() {
    const { ctx } = this;
    const rules = {
      status: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { status } = ctx.request.body;
    await ctx.model.User.updateOne({ email: ctx.session.userInfo.email }, { isEmailRemind: status });
    ctx.body = { code: 200, msg: '修改成功' };
  }

  // 修改是否需要邮件提醒
  async changeMakeOrderRemind() {
    const { ctx } = this;
    const rules = {
      status: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { status } = ctx.request.body;
    await ctx.model.User.updateOne({ email: ctx.session.userInfo.email }, { isMakeOrderRemind: status });
    ctx.body = { code: 200, msg: '修改成功' };
  }

  async generateCode() {
    const numCode = Math.floor((Math.random()*100000)+1);
    return numCode.toString().padStart(6,'7');
  }

}

module.exports = EmailController;
