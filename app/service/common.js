'use strict';

const Service = require('egg').Service;
const qiniu = require('qiniu');

class CommonService extends Service {

  async init() {
    const { ctx } = this;
    const data = await ctx.model.Common.findOne({});
    const uploadToken = await this.getUploadToken();
    const isLogin = ctx.session.userInfo ? true : false;

    if (!data) {
      return { school: [], navbar: [], csrf: ctx.csrf, uploadToken, code: 200 };
    }
    return { school: data.schools, navbar: data.navbars, csrf: ctx.csrf, uploadToken, code: 200, isLogin };
  }

  async getUploadToken() {
    const { accessKey, secretKey, bucket } = this.app.config.qiniu;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }
}

module.exports = CommonService;
