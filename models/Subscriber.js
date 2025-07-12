const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // Adjust the path to your Sequelize instance

const Subscriber = sequelize.define('Subscriber', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensure the email format is valid
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      fields: ['createdAt'],
      using: 'BTREE',
      expireAfterSeconds: 90 * 24 * 60 * 60, // Define TTL (90 days)
    },
  ],
  tableName: 'subscribers',
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = Subscriber;