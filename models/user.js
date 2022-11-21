'use strict';

const Sequelize = require('sequelize'); 
const bcrypt = require('bcrypt'); 

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    firstName:{
      type: Sequelize.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'First Name Is Required',
        },
        notEmpty: {
          msg: 'Please provide first name',
        },
      },
    }, 
    lastName: {
      type: Sequelize.STRING, 
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'Last Name Is Required',
        },
        notEmpty: {
          msg: 'Please provide last name',
        },
      },
    }, 
    emailAddress: {
      type: Sequelize.STRING, 
      allowNull: false, 
      unique: {
        msg: 'The email you entered already exists',
      },
      validate: {
        notNull: {
          msg: 'An Email Is Required',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    }, 
    password: {
      type: Sequelize.STRING,
      allowNull: false,  
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
    },
      validate: {
        notNull: {
          msg: 'A Password Is Required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    }
  }, {sequelize});

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'courseOwner', 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  
  return User;
};