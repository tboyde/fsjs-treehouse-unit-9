'use strict';

const Sequelize = require('sequelize'); 

module.exports = (sequelize) => {
  class Course extends Sequelize.Model{}
  Course.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'Course Title Is Required',
        },
        notEmpty: {
          msg: 'Please provide Course Title',
        },
      },
    }, 
    description:{
      type: Sequelize.TEXT, 
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'Description Is Required',
        },
        notEmpty: {
          msg: 'Please provide Course Description',
        },
      },
    }, 
    estimatedTime:{
      type: Sequelize.STRING, 
    }, 
    materialsNeeded: {
      type: Sequelize.STRING, 
    }
  }, {sequelize});

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'courseOwner', 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false, 
      },
    });
  };

  return Course;
};