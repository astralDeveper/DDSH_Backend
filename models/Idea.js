const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Idea = sequelize.define('Idea', {
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
  pro_typ: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
}, {
  timestamps: true, // adds createdAt, updatedAt
});

module.exports = Idea;