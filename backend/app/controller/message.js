'use strict';

const Controller = require('egg').Controller;

class MessageCOntroller extends Controller {

  /**
   * 获取消息列表
   */
  async messageList() {
    const { ctx } = this;

    const userInfo = ctx.session.userInfo;
    const messageList = await ctx.model.MessageList.find({ belong: userInfo.userId }).sort({ createTime: -1 });

    ctx.body = { code: 0, messageList };

  }

  /**
   * 获取某个联系人的聊天记录
   */
  async message() {
    const { ctx } = this;

    const rules = {
      othersUserId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { othersUserId } = ctx.query;
    const { userId } = ctx.session.userInfo;
    const messages = await ctx.model.Message.find({
      belong: userId,
      $or   : [
        { sendUserId: userId, receiveUserId: othersUserId },
        { sendUserId: othersUserId, receiveUserId: userId },
      ],
    },
    { belong: 0 }
    );

    const friendInfo = await ctx.service.user.getUserInfo(othersUserId);
    ctx.body = { code: 0, messages, friendInfo };
  }

  /**
   * 清空未读消息
   */
  async emptyNotReadNum() {
    const { ctx } = this;
    const rules = {
      othersUserId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { othersUserId } = ctx.query;
    const { userId } = ctx.session.userInfo;
    await ctx.model.MessageList.updateOne({ belong: userId, othersUserId }, { notReadNum: 0 });
    ctx.body = { code: 0, msg: '成功' };
  }


}

module.exports = MessageCOntroller;
