module.exports = {
  schedule: {
    cron: '0 0 */1 * * *',  // 每小时执行一次
    type: 'worker', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const goods = await ctx.model.Goods.find({ status: 1 });
    if (goods.length) {
      // 给管理员发邮件提醒
      const html = `
        <a href="www.wrpxcx.com/second">from: 大学生闲置物品交易平台</a>
        <div>尊敬的管理者, 您好：<div>
          <p>请及时审核商品</p>
          <p>现已累计：${goods.length} 个商品没有审核</p>
          
          <p>\n</p>
          <p></p>
          <p></p>
          <p>大学生闲置物品交易平台开发者</p>
      `;

      // await ctx.service.email.sendMail('2892168321@qq.com', '商品审核提醒', html);
      await ctx.service.email.sendMail('1091123908@qq.com', '商品审核提醒', html);
    }
  }
};