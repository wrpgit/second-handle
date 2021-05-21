'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {

  async init() {
    const { ctx } = this;
    const data = await ctx.service.common.init();
    ctx.body = { data };
  }

  async insertNavbar() {
    const { ctx } = this;
    const navbar = ctx.request.body.navbar;
    console.log(navbar);
    const res = await ctx.model.Navbar.insertMany(navbar);
    console.log(res);
    ctx.body = { code: 200, msg: 'success' };
  }

  async createCollection() {
    if (this.ctx.session.userInfo.email === '1091123908@qq.com') {
      await this.ctx.model.Common.create({ schools: ['河北大学', '广州大学', '河北工业大学'], navbars: ['课本', '课外书籍', '杂物', '其它'] });
      this.ctx.body = { code: 200, msg: 'success' };
      return;
    }
    this.ctx.body = { code: 200, msg: '没有操作权限' };
  }
}

module.exports = CommonController;
