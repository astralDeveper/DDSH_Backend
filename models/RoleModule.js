const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // Assuming your Sequelize instance is stored in database.js

const RoleModule = sequelize.define('RoleModule', {
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles', // Refers to the 'roles' table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules', // Refers to the 'modules' table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'role_modules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = RoleModule;
