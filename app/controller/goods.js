'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {

  /**
   * 上传商品信息
   */
  async publishGoods() {
    const { ctx } = this;
    const data = ctx.request.body;
    const rules = {
      goodsName: { type: 'string', required: true },
      type: { type: 'string', required: true },
      description: { type: 'string', required: true },
      num: { type: 'number', required: true, min: 1 },
      price: { type: 'string', required: true },
      schoolName: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) {
      ctx.body = { code: 1, msg: '参数错误' };
      return;
    }
    await ctx.service.goods.publishGoods(data);
    ctx.body = { code: 200, msg: 'success' };
  }

  /**
   * 根据类别获取商品信息
   */
  async getGoodsByType() {
    const { ctx } = this;
    const rules = {
      type: { type: 'string', required: true },
      startNum: { type: 'number', required: true, min: 0 },
      num: { type: 'number', required: true },
      school: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { type, startNum, num, school } = ctx.query;
    const goods = await ctx.service.goods.getGoodsByType(type, startNum, num, school);
    ctx.body = { code: 200, msg: 'success', goods };
  }

  async getGoodsById() {
    const { ctx } = this;
    const rules = {
      goodsId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }
    const { goodsId } = ctx.query;
    ctx.body = await ctx.service.goods.getGoodsById(goodsId);
  }

  async delGoods() {
    const { ctx } = this;
    const rules = {
      goodsId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { goodsId } = ctx.query;
    await ctx.service.goods.delGoods(goodsId);
    ctx.body = { code: 200, msg: 'success' };
  }

  async modify() {
    const { ctx } = this;
    const rules = {
      _id: { type: 'string', required: true },
      goodsName: { type: 'string', required: true },
      typeName: { type: 'string', required: true },
      schoolName: { type: 'string', required: true },
      description: { type: 'string', required: true },
      num: { type: 'number', required: true, min: 1 },
      price: { type: 'number', required: true, min: 0 },
    };
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { _id, goodsName, typeName, schoolName, description, num, price } = ctx.request.body;
    await ctx.model.Goods.updateOne({ _id }, { goodsName, typeName, schoolName, description, num, price, status: 1 });
    ctx.body = { code: 0, msg: 'success' };
  }

  async getGoodsByUser() {
    const { ctx } = this;
    const rules = {
      userId: { type: 'string', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { userId } = ctx.query;
    const userInfo = await this.ctx.service.user.getUserInfo(userId);
    const goods = await ctx.service.goods.getGoodsByUser(userId);
    ctx.body = { code: 200, msg: 'success', goods, userInfo };
  }

  async searchGoods() {
    const { ctx } = this;
    const rules = {
      startNum: { type: 'number', required: true, min: 0 },
      num: { type: 'number', required: true, min: 1 },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { keyword, startNum, num } = ctx.query;
    const goods = await ctx.service.goods.searchGoods(keyword, Number(startNum), Number(num));

    ctx.body = { code: 1, goods };
  }

  // 商品审核操作
  async goodsReview() {
    const { ctx } = this;
    const rules = {
      goodsId: { type: 'string', required: true, max: 30 },
      reason: { type: 'string', required: false, default: '无', max: 100 },
      status: { type: 'enum', required: true, values: ['2', '3'] },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { goodsId, reason, status } = ctx.query;
    ctx.body = await ctx.service.goods.goodsReview(goodsId, reason, Number(status));
  }

  // 获取待审核的商品列表
  async reviewList() {
    const { ctx } = this;
    const rules = {
      startNum: { type: 'number', required: true, min: 0 },
      num: { type: 'number', required: true },
    };
    const errors = this.app.validator.validate(rules, ctx.query);
    if (errors) { ctx.body = { code: 1, msg: '参数错误' }; return; }

    const { startNum, num } = ctx.query;
    const goods = await ctx.service.goods.reviewList(startNum, num);
    ctx.body = { code: 200, msg: 'success', goods };

  }
}

module.exports = GoodsController;
