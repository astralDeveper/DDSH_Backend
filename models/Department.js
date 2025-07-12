const { DataTypes } = require("sequelize");
const sequelize = require('../db.js'); // Ensure your Sequelize instance is imported

const Department = sequelize.define(
  "Department",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the field is not empty
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Ensures the value is a valid email address
        notEmpty: true, // Ensures the field is not empty
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: "departments", // Optional: Specify the table name
  }
);

module.exports = Department;