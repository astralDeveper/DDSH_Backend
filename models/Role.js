const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'roles',
  timestamps: true, // We are manually handling created_at and updated_at
  createdAt: 'created_at',  // Specify the custom column name for createdAt
  updatedAt: 'updated_at', 
});

module.exports = Role;
