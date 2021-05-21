'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {

  async createOrder() {
    const { ctx } = this;
    const rules = {
      goodsId: { type: 'string', required: true },
      num: { type: 'number', required: true, min: 1 },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { goodsId, num } = ctx.request.body;

    ctx.body = await ctx.service.order.createOrder(goodsId, num);
  }

  // 通过orderId 获取指定订单
  async getOrder() {
    const { ctx } = this;
    const rules = {
      orderId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) {
      ctx.body = { code: 1, msg: '参数错误' };
      return;
    }
    const { orderId } = ctx.request.body;
    ctx.body = await ctx.service.order.getOrder(orderId);
  }

  // 通过orderStatus 查询订单
  async orderList() {
    const { ctx } = this;
    const { operation } = ctx.query;
    ctx.body = await ctx.service.order.orderList(operation);
  }

  // 修改订单状态
  async changeStatus() {
    const { ctx } = this;
    const { orderId, status } = ctx.request.body;

    ctx.body = await ctx.service.order.changeStatus(orderId, status);
  }

  // 获取各个状态订单的数量
  async getOrderNum() {
    const { ctx } = this;

    ctx.body = await ctx.service.order.getOrderNum();
  }
}

module.exports = OrderController;
