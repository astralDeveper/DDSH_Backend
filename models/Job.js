const { DataTypes } = require('sequelize');
const sequelize = require('../db.js'); // Assuming you have a configured Sequelize instance
const Department = require('./Department.js');

const Job = sequelize.define('Job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM('fulltime', 'parttime'),
  },
  responsb: {
    type: DataTypes.STRING,
  },
  skills: {
    type: DataTypes.STRING,
  },
  designation: {
    type: DataTypes.STRING,
  },
  requirements: {
    type: DataTypes.STRING,
  },
  deadline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.INTEGER,
    references: {
      model: Department, // This refers to the Department model
      key: 'id', // Assuming the Department model has an 'id' field
    },
    allowNull: false,
  },
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Job;
