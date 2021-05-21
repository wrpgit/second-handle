'use strict';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 5;

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    userId: {
      type   : String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isEmailRemind: {
      type: Boolean,
      required: true,
      default: true,
      commont: "如果不在线是否发送邮件提醒",
    },
    isMakeOrderRemind: {
      type: Boolean,
      required: true,
      default: true,
      commont: "下单是否邮件提醒",
    },
    password: {
      type   : String,
      required: true,
    },
    nickName: {
      type   : String,
      required: true,
    },
    userSchool: {
      type   : String,
      required: true,
    },
    avatarUrl: {
      type   : String,
      required: true,
      default: app.config.default.defaultHeadAddress,
    },
  });

  userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return mongoose.model('User', userSchema);
};
