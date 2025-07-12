const sequelize = require('../db.js');
const { DataTypes, Sequelize } = require('sequelize');
const BlogCat = require('./BlogCat.js');

const Blog = sequelize.define('Blog', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT('long'),
    allowNull: false,
  },
  alt_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  caption_img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emails: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  can_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  focus_keys: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soc_tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  excerpt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('schedule', 'publish', 'draft'),
    allowNull: false,
  },
  schedule_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER, // Assuming BlogCat has an integer primary key
    allowNull: false,
    references: {
      model: BlogCat,
      key: 'id', // Assuming the primary key in BlogCat is 'id'
    },
  },
}, { 
  tableName: 'blogs',
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = Blog;
