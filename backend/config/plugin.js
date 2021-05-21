'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  cors: {
    enable : false,
    package: 'egg-cors',
  },
  validate: {
    enable : true,
    package: 'egg-validate',
  },
  mongoose: {
    enable : true,
    package: 'egg-mongoose',
  },
  io: {
    enable : true,
    package: 'egg-socket.io',
  },
  redis: {
    enable : true,
    package: 'egg-redis',
  },
};
