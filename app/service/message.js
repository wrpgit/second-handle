'use strict';

const Service = require('egg').Service;

class MessageService extends Service {

  /**
   * 向某人发送消息
   * @param {String} othersUserId - 接收消息的userId
   * @param {String} context      - 消息内容
   */
  async sendMessage(othersUserId, context) {
    const { ctx } = this;
    const userInfo = ctx.session.userInfo;

    const date = new Date().format('yyyy-MM-dd hh:mm:ss');
    await ctx.model.Message.insertMany([
      { context, createTime: date, sendUserId: userInfo.userId, receiveUserId: othersUserId, belong: userInfo.userId, isRead: true },
      { context, createTime: date, sendUserId: userInfo.userId, receiveUserId: othersUserId, belong: othersUserId, isRead: false },
    ]);

    const othersUserInfo = await ctx.model.User.findOne({ userId: othersUserId });
    const { nickName: othersNickName, avatarUrl: othersAvatar } = othersUserInfo;
    // 更新消息列表
    await ctx.model.MessageList.findOneAndUpdate({ belong: userInfo.userId, othersUserId },
      { context, createTime: date, othersNickName, othersAvatar },
      { upsert: true, new: true });
    await ctx.model.MessageList.findOneAndUpdate({ belong: othersUserId, othersUserId: userInfo.userId },
      { context, createTime: date, othersNickName: userInfo.nickName, othersAvatar: userInfo.avatarUrl, $inc: { notReadNum: 1 } },
      { upsert: true }
    );
  }

}

module.exports = MessageService;
