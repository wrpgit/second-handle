# second-hand-goods

大学生二手物品交易服务端

## QuickStart



后端在backend文件中，后端使用Node.js,  egg.js框架，egg.js文档https://eggjs.org

前端在front文件中，使用vue.js, uni-app框架，uni-app官方文档：https://uniapp.dcloud.io/collocation/pages



#### Script

```bash
git clone git@github.com:wrpgit/second-handle.git
cd second-handle

# 进入后端项目
cd backend
# 安装依赖
npm install
# 本地运行
npm run dev
```

后端配置文件config/config.default.js

```js
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {

  const config = exports = {};

  config.keys = appInfo.name + '_1609766559036_8238';

  config.middleware = [];

  config.mongoose = {
    url    : 'mongodb://127.0.0.1/second_hand',
    options: {
      server: {
        poolSize: 40,
      },
      auth: { authSource: "admin" },
      user: 'user',
      pass: 'password'
    },
  };

  config.validate = {   // 配置参数校验器，基于parameter
    convert: true,    // 对参数可以使用convertType规则进行类型转换
  };

  config.default = {
    defaultHeadAddress: '',
    // 系统管理员
    systemAdmin: ['1091123908@qq.com', '2892168321@qq.com']
  };
  config.cors = {
    origin      : 'http://127.0.0.1:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials : true,
  };

  config.security = {
    // 是否使用csrf验证
    csrf: {
      enable: true,
    },
    // 白名单
    domainWhiteList: [ '*' ],
  };

  // 七牛云配置
  config.qiniu = {
    accessKey: 'qi_niu_yun_access_key',
    secretKey: 'qi_niu_yun_secret_key',
    bucket   : 'bucket_name',
  };


  // socket配置
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware    : [ 'packet' ],
      },
    },
  };

  // redis配置
  config.redis = {
    client: {
      port    : 6379,
      host    : '127.0.0.1',
      password: '',
      db      : 7,
    },
  }
  
  // 发送邮件的配置, 使用qq提供的服务，密码为授权的是码
  config.emailConfig = {
    authUser    : 'qq_email',
    authPassword: 'shou_quan_ma',
  }

  return {
    ...config,
  };
};

```

