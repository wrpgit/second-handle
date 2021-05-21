'use strict';

const Service = require('egg').Service;

class OrderService extends Service {

  async createOrder(goodsId, num) {
    const { ctx } = this;

    // 应当使用事务, 保证一致(目前没使用)
    const goods = await ctx.model.Goods.findOne({ _id: goodsId });
    const order = await ctx.model.Order.insertMany({
      goodsId,
      sailUserId: goods.userId,
      buyUserId : ctx.session.userInfo.userId,
      num,
      totalPrice: goods.price * num,
      createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
    });
    await ctx.model.Goods.updateOne({ _id: goodsId }, { $inc: { num: -num } });

    ctx.service.email.sendMakeOrderNotice(goods, order[0]);
    return { code: 200, msg: 'success', order: order[0] };
  }


  // 通过orderId 获取指定订单
  async getOrder(orderId) {
    const { ctx } = this;
    const order = await ctx.model.Order.aggregate([
      { $match: { _id: this.app.mongoose.Types.ObjectId(orderId) } },
      { $addFields: { objectId: { $toObjectId: '$goodsId' } } },
      { $lookup: {
        from        : 'goods',
        localField  : 'objectId',
        foreignField: '_id',
        as          : 'goodsInfo' } },
    ]);
    if (!order) {
      return { code: 1, msg: '没有找到该订单' };
    }
    return { code: 200, msg: 'success', order };

  }

  async orderList(operation) {
    const { ctx } = this;
    let orders;
    if (operation === '待收货') {
      orders = await ctx.model.Order.aggregate([
        { $match: { orderStatus: 1, buyUserId: ctx.session.userInfo.userId } },
        { $addFields: { objectId: { $toObjectId: '$goodsId' } } },
        { $lookup: {
          from        : 'goods',
          localField  : 'objectId',
          foreignField: '_id',
          as          : 'goodsInfo' } },
      ]);
    } else if (operation === '待送货') {
      orders = await ctx.model.Order.aggregate([
        { $match: { orderStatus: 1, sailUserId: ctx.session.userInfo.userId } },
        { $addFields: { objectId: { $toObjectId: '$goodsId' } } },
        { $lookup: {
          from        : 'goods',
          localField  : 'objectId',
          foreignField: '_id',
          as          : 'goodsInfo' } },
      ]);
    } else if (operation === '我买到的') {
      orders = await ctx.model.Order.aggregate([
        { $match: { orderStatus: { $in: [ 2, 3 ] }, buyUserId: ctx.session.userInfo.userId } },
        { $addFields: { objectId: { $toObjectId: '$goodsId' } } },
        { $lookup: {
          from        : 'goods',
          localField  : 'objectId',
          foreignField: '_id',
          as          : 'goodsInfo' } },
      ]);
    } else if (operation === '我卖出的') {
      orders = await ctx.model.Order.aggregate([
        { $match: { orderStatus: { $in: [ 2, 3 ] }, sailUserId: ctx.session.userInfo.userId } },
        { $addFields: { objectId: { $toObjectId: '$goodsId' } } },
        { $lookup: {
          from        : 'goods',
          localField  : 'objectId',
          foreignField: '_id',
          as          : 'goodsInfo' } },
      ]);
    } else {
      return { code: 11, msg: '参数错误' };
    }
    return { code: 200, msg: 'success', orders };
  }


  // 修改订单状态
  async changeStatus(orderId, status) {
    const { ctx } = this;
    const userId = ctx.session.userInfo.userId;

    const order = await ctx.model.Order.findOneAndUpdate({ _id: orderId, $or: [{ sailUserId: userId }, { buyUserId: userId }] }, { orderStatus: status });
    if (Number(status) === 0) {
      // 取消订单，将库存加回来
      await ctx.model.Goods.updateOne({ _id: order.goodsId }, { $inc: { num: order.num } });
    }
    return { code: 200, msg: 'success' };
  }

  // 获取各个状态订单的数量
  async getOrderNum() {
    const { ctx } = this;
    const userId = ctx.session.userInfo.userId;

    const orderNum = await ctx.model.Order.find({ $or: [{ sailUserId: userId }, { buyUserId: userId }]});
    const data = {
      daiShouHuo: 0,
      maiDaoDe: 0,
      maiChuDe: 0,
      daiSongHuo: 0,
    }
    for (const item of orderNum) {
      if (item.buyUserId === userId) {
        if (item.orderStatus === 1) {
          data['daiShouHuo'] += 1;
        } else if (item.orderStatus >= 2) {
          data['maiDaoDe'] += 1;
        }
      } else if (item.sailUserId === userId) {
        if (item.orderStatus === 1) {
          data['daiSongHuo'] += 1;
        } else if (item.orderStatus >= 2) {
          data['maiChuDe'] += 1;
        }
      }
    }

    return { code: 200, msg: 'success', data };
  }
}

module.exports = OrderService;
