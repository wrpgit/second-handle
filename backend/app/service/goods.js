'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {

  async publishGoods(data) {
    const { ctx } = this;
    const { goodsName, type, schoolName, description, num, price, images } = data;
    const { userInfo } = ctx.session;
    await ctx.model.Goods.create({
      userId    : userInfo.userId,
      goodsName,
      price,
      description,
      schoolName,
      typeName  : type,
      images    : images.split(','),
      num,
      createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
    });
  }

  // 按分类查询商品
  async getGoodsByType(type, startNum, num, school) {
    return await this.ctx.model.Goods.find({ typeName: type, schoolName: school, status: 2, num: { $gt: 0 } })
      .sort({ price: 1, createTime: 1 })
      .skip(startNum)
      .limit(num)
      .exec();
  }


  // 通过商品id查询商品
  async getGoodsById(goodsId) {
    const { ctx, ctx: { session } } = this;
    const goods = await ctx.model.Goods.findOne({ _id: goodsId }).lean();
    if (!goods) {
      return { code: 1, msg: '没有找到该物品' };
    }
    if (session.userInfo && session.userInfo.userId === goods.userId && goods.status === 3) {
      // 如果该商品属于当前登陆用户，返回审核状态信息, 审核未通过才返回未通过原因
      const review = await ctx.model.Review.findOne({ _id: goods.reviewId });
      if (review) {
        // 兼容处理
        goods.reason = review.reason;
      } else {
        goods.reason = '无'
      }
    }
    return { code: 0, msg: '成功', goods };
  }

  // 通过发布者查询商品
  async getGoodsByUser(userId) {
    const { ctx: { session: { userInfo } } } = this;
    if (userInfo && userInfo.userId === userId) {
      return await this.ctx.model.Goods.find({ userId, status: { $in: [1, 2, 3] } });
    } else {
      return await this.ctx.model.Goods.find({ userId, status: 2 });
    }
  }

  // 删除商品
  async delGoods(goodsId) {
    const userId = this.ctx.session.userInfo.userId;
    await this.ctx.model.Goods.updateOne({ _id: goodsId, userId }, { status: 0 });
  }


  // 根据关键字查找商品
  async searchGoods(keyword, startNum, num) {
    const reg = new RegExp('^.*' + keyword);
    if (this.ctx.session.userInfo) {
      // 如果登陆了，按用户所在学校查询
      return await this.ctx.model.Goods.find({ schoolName: this.ctx.session.userInfo.userSchool, goodsName: { $regex: reg }, status: 2, num: { $gt: 0 } })
        .sort({ price: 1, createTime: 0 })
        .skip(startNum)
        .limit(num)
        .exec();
    }
    // 没有登陆，查询所有学校的
    return await this.ctx.model.Goods.find({ goodsName: { $regex: reg }, status: 2, num: { $gt: 0 } })
      .sort({ price: 1, createTime: 0 })
      .skip(startNum)
      .limit(num)
      .exec();
  }

  async goodsReview(goodsId, reason, status) {

    const { ctx } = this;
    const review = await ctx.model.Review.create({ goodsId, createTime: new Date().format(), reason, status });
    await ctx.model.Goods.updateOne({ _id: goodsId, status: 1 }, { status, reviewId: review._id });
    return { code: 0, msg: '操作成功' };
  }

  async reviewList(startNum, num) {
    return await this.ctx.model.Goods.find({ status: 1 })
      .sort({ createTime: 1 })
      .skip(startNum)
      .limit(num)
      .exec();
  }

}

module.exports = GoodsService;
