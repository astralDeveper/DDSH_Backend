const { DataTypes } = require('sequelize');
const Blog = require('./Blog.js');
const Tag = require('./Tag.js');
const sequelize = require('../db.js');

const BlogTag = sequelize.define('BlogTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Blog,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tag,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  tableName: 'blogtags',// Explicit table name (optional)
});

module.exports = BlogTag;
