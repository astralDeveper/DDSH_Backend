const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // assuming your Sequelize instance is in config/db.js

const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Ensures that the name is required
  },
}, {
  tableName: 'tags',
  timestamps: true, // Adds `createdAt` and `updatedAt` automatically
});

module.exports = Tag;
