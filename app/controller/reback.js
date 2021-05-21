'use strict';

const Controller = require('egg').Controller;

class RebackController extends Controller {

  async reback() {
    const { ctx } = this;
    const rules = {
      context: { type: 'string', required: true },
    }
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 200, msg: '参数错误' }; return; }

    const { context } = ctx.request.body;
    const email = ctx.session.userInfo ? ctx.session.userInfo.email : '未登录用户';
    const date = new Date().format('yyyy-MM-dd hh:mm:ss');
    await ctx.model.Reback.create({ context, email, createTime: date});

    const html = `
      <a href="www.wrpxcx.com/second">from: 大学生闲置物品交易平台</a>
      <div>尊敬的用户, 您好：<div>
        <p>有人给你反馈，反馈者：<b>${email}</b>
        <p>时间: <b>${date}</b>
        <p>反馈的内容为：</p>
        <p>${context}</p>
        <p>大学生闲置物品交易平台开发者</p>
    `;
    ctx.service.email.sendMail('1091123908@qq.com', '建议反馈', html);
    ctx.body = { code: 0, msg: 'success' };
  }
}

module.exports = RebackController;
