const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Inquiry = sequelize.define('Inquiry', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  }, 
}, {
  timestamps: true, // adds createdAt, updatedAt
});

module.exports = Inquiry;