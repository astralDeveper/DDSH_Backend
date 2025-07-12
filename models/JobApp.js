const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Department = require('./Department.js');
const Job = require('./Job.js');

const JobApp = sequelize.define('JobApp', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Name is required
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true, // Phone is optional
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Email is optional
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true, // Resume is optional
  },
  category: {
    type: DataTypes.ENUM('job', 'career'),
    allowNull: true, // Category is optional, default is null
  },
  department: {
    type: DataTypes.INTEGER,
    references: {
      model: Department, // Assuming Department is another Sequelize model
      key: 'id', // Reference key for the Department model
    },
    allowNull: true, // Department is optional
  },
  // Foreign key for Job model
  job: {
    type: DataTypes.INTEGER,
    references: {
      model:'jobs',
      key: 'id', // Reference key for the Job model
    },
    allowNull: true, // Job is optional
  },
}, {
  tableName: 'jobapps',
  timestamps: true,
});

module.exports = JobApp;
