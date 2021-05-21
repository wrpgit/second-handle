'use strict';

const Service = require('egg').Service;
const nodemailer = require('nodemailer');


class EmailService extends Service {

  // 发送消息提醒邮件
  async sendEmailNotice(num, email) {
    const { ctx } = this;
    const html = `
      <a href="www.wrpxcx.com/second">from: 大学生闲置物品交易平台</a>
      <div>尊敬的用户, 您好：<div>
        <p>在<a href="www.wrpxcx.com/second">大学生闲置物品交易平台</a>上有人给您发消息, 现已累计${num}条未查看，点击上方链接或访问<b>www.wrpxcx.com/second</b>查看</p>
        <p>如果想取消订阅消息提醒，可前往平台中依次点击 ‘我的’ -> ‘设置’ -> ‘是否接收邮件消息’, 取消订阅即可，感谢您的使用</p>
        <p>您有什么建议可以直接联系此邮箱，或在平台中的反馈渠道进行反馈</p>

        <h3>(附: 邮件提醒规则)</h3>
        <p>
        每次提醒间隔为1个小时, 自收到离线后的第一条消息算起。离线后，如果开启订阅，在收到消息后会收到邮件提醒，邮件提醒沉默周期为1个小时，也就是说，1个小时内的消息不会再发邮件提醒，超过1小时的消息后发邮件，同时显示消息数量，再沉默1小时，上线后清零。
        
        </p>
        
        <p>\n</p>
        <p></p>
        <p></p>
        <p>再次感谢!</p>
        <p>大学生闲置物品交易平台开发者</p>
    `;

    // 发送邮件
    const isSend = await ctx.service.email.sendMail(email, '消息提醒', html);
    if (isSend) {
      ctx.body = { code: 200, msg: '发送成功' };
      return;
    }
      ctx.body = { code: 1, msg: '发送失败' };
  }

  // 发送下单后的邮件通知
  async sendMakeOrderNotice(goods, order) {
    const { ctx } = this;
    // 获取邮箱
    const userInfo = await ctx.model.User.findOne({ userId: goods.userId }, { email: 1, isMakeOrderRemind: 1 });
    if (!userInfo || !userInfo.isMakeOrderRemind) {
      ctx.body = { code: 200, msg: '发送成功' };
      return;
    }
    const html = `
      <a href="www.wrpxcx.com/second">from: 大学生闲置物品交易平台</a>
      <div>尊敬的用户, 您好：<div>
        <p>在<a href="www.wrpxcx.com/second">大学生闲置物品交易平台</a>有人给你下单了, 快去看看吧，记得和买家沟通交易方式哦!</p>
        <p>商品信息：</p>
        <p>商品名称：${goods.goodsName}</p>
        <p>商品价格：${goods.price}</p>
        <p>商品描述：${goods.description}</p>
        <p>购买数量：${order.num}</p>
        <p>总价：    ${order.totalPrice}</p>
      buyUserId : ${ctx.session.userInfo.userId},
        <p>下单用户id：${ctx.session.userInfo.userId}</p>
        <p>下单用户昵称：${ctx.session.userInfo.nickName}</p>
        <p></p>
        <p></p>
        <p>下单时间：${order.createTime}</p>
  
        
        <p>如果想取消订单提醒，可前往平台中依次点击 ‘我的’ -> ‘设置’ -> ‘是否接收下单消息通知’, 取消订阅即可，感谢您的使用</p>
        <p>您有什么建议可以直接联系此邮箱，或在平台中的反馈渠道进行反馈</p>

        <p>\n</p>
        <p></p>
        <p></p>
        <p>再次感谢!</p>
        <p>大学生闲置物品交易平台开发者</p>
    `;

    // 发送邮件
    const isSend = await ctx.service.email.sendMail(userInfo.email, '下单通知', html);
    if (isSend) {
      ctx.body = { code: 200, msg: '发送成功' };
      return;
    }
      ctx.body = { code: 1, msg: '发送失败' };
  }

  async sendMail(to, subject, html) {
    const { authUser, authPassword } = this.app.config.emailConfig;

    const transporter = nodemailer.createTransport({
      service: 'qq', // 调用qq服务器
      secureConnection: true, // 启动SSL
      port: 465, // 端口就是465
      auth: {
        user: authUser,
        pass: authPassword, 
      },
    });

    const mailOptions = {
      from: authUser, // 发送者
      to,
      subject: `[大学生闲置物品交易平台]${subject}`,
      html,
    };

    // 发送邮件
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      this.ctx.logger.error('发送邮件时出错: ', err);
      return false;
    }
  };

  async checkEmail(email) {
    const reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    return reg.test(email);
  }
}

module.exports = EmailService;
