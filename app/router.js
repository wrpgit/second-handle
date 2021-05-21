'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const verification = app.middleware.verification;
  const isAdmin = app.middleware.isAdmin;
  const { router, controller, io } = app;

  /**
   * commen 相关
   */
  router.get('/api/v1/common/init', controller.common.init);
  router.get('/api/v1/common/createCollection', verification(), controller.common.createCollection);


  // user相关
  router.post('/api/v1/user/signup', controller.user.signup);
  router.post('/api/v1/user/login', controller.user.login);
  router.get('/api/v1/user/info', controller.user.info);
  router.post('/api/v1/user/changePassword', controller.user.changePassword);
  router.post('/api/v1/user/changeInfo', verification(), controller.user.changeInfo);
  router.get('/api/v1/user/loginout', controller.user.loginout);

  // goods相关
  router.post('/api/v1/goods/updata', verification(), controller.goods.publishGoods);
  router.post('/api/v1/goods/modify', verification(), controller.goods.modify);
  router.get('/api/v1/goods/goods', controller.goods.getGoodsByType);
  router.get('/api/v1/goods/goodsId', controller.goods.getGoodsById);
  router.get('/api/v1/goods/delGoods', verification(), controller.goods.delGoods);
  router.get('/api/v1/goods/userGoods', verification(), controller.goods.getGoodsByUser);
  router.get('/api/v1/goods/searchGoods', controller.goods.searchGoods);

  router.get('/api/v1/goods/goodsReview', isAdmin(), controller.goods.goodsReview);
  router.get('/api/v1/goods/reviewList', isAdmin(), controller.goods.reviewList);


  // order 订单相关
  router.post('/api/v1/order/createOrder', verification(), controller.order.createOrder);
  router.post('/api/v1/order/getOrder', verification(), controller.order.getOrder);
  router.post('/api/v1/order/changeStatus', verification(), controller.order.changeStatus);
  router.get('/api/v1/order/orderList', verification(), controller.order.orderList);
  router.get('/api/v1/order/getOrderNum', verification(), controller.order.getOrderNum);


  // 消息相关
  router.get('/api/v1/message/messageList', verification(), controller.message.messageList);
  router.get('/api/v1/message/message', verification(), controller.message.message);
  router.get('/api/v1/message/emptyNotReadNum', verification(), controller.message.emptyNotReadNum);

  io.route('disconnect', io.controller.chat.disconnect);


  // 邮件相关
  router.post('/api/v1/email/verificationCode', controller.email.verificationCode);
  router.post('/api/v1/email/changePasswordCode', controller.email.changePasswordCode);
  router.post('/api/v1/email/changeSubscribe', verification(), controller.email.changeSubscribe);
  router.post('/api/v1/email/changeMakeOrderRemind', verification(), controller.email.changeMakeOrderRemind);

  // 反馈相关
  router.post('/api/v1/reback/reback', controller.reback.reback);

};
