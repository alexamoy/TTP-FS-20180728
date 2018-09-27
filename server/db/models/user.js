const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password');
    }
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    }
  },
  balance: {
    type: Sequelize.DECIMAL(19,2),
    allowNull: false,
    defaultValue: 5000.00
  }
});

User.prototype.realPassword = function(pwd) {
  return User.encryptPassword(pwd, this.salt()) === this.password();
};

User.createSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(pwdText, salt) {
  return crypto.createHash('RSA-SHA256').update(pwdText).update(salt).digest('hex');
};

const setSaltPassword = user => {
  if (user.changed('password')) {
    user.salt = User.createSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltPassword);
User.beforeUpdate(setSaltPassword);

module.exports = User;
