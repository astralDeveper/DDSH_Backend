const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // Make sure to import sequelize instance

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure the name is required
  },
}, {
  timestamps: true, // Sequelize will automatically manage createdAt and updatedAt
  tableName: 'blogcat', // You can specify the table name if needed
});

module.exports = Category;
