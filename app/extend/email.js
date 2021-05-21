// 引入nodemailer
const nodemailer = require('nodemailer');

// 封装发送者信息
const transporter = nodemailer.createTransport({
  service: 'qq', // 调用qq服务器
  secureConnection: true, // 启动SSL
  port: 465, // 端口就是465
  auth: {
    user: '1091123908@qq.com', // 账号
    // pass: 'lzxnceyrpqvtgjgb', // 授权码,
    pass: 'wbxewihlydqfhhif', 

  },
});

// 邮件参数及内容
const mailOptions = {
  from: 'xxxxx@qq.com', // 发送者,与上面的user一致
  to: 'xxxx@xxx.com', // 接收者,可以同时发送多个,以逗号隔开
  subject: '测试的邮件', // 标题
  // text: '测试内容', // 文本
  html: '<h2>测试一下:</h2><a class="elem-a" href="https://baidu.com"><span class="content-elem-span">测试链接</span></a>',
};

// 调用函数，发送邮件
await transporter.sendMail(mailOptions, function(err, info) {
  if (err) {
    console.log(err);
    return;
  }
  // console.log(info);

});
