const Role = require('./Role.js');
const Module = require('./Module.js');
const RoleModule = require('./RoleModule.js');
const Job = require('./Job.js');
const JobApp = require('./JobApp.js');
const Department = require('./Department.js');
const BlogTag = require('./BlogTag.js');
const User = require('./User.js');
const Blog = require('./Blog.js');
const BlogCat = require('./BlogCat.js');
const Tag = require('./Tag.js');
const Category = require('./BlogCat.js');

function initAssociations() {
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'roleDetails' });
  Role.hasMany(User, { foreignKey: 'roleId' });
  Role.belongsToMany(Module, { through: RoleModule, as: 'modules', foreignKey: 'role_id' });
  Module.belongsToMany(Role, { through: RoleModule, as: 'roles', foreignKey: 'module_id' });
  Job.hasMany(JobApp, { foreignKey: 'job' });
  JobApp.belongsTo(Job, { foreignKey: 'job' });
  JobApp.belongsTo(Department, { foreignKey: 'department' });
  Job.belongsTo(Department, { foreignKey: 'department', });
  Department.hasMany(Job, { foreignKey: 'department', });
  Blog.belongsTo(BlogCat, { as: 'category', foreignKey: 'categoryId' });

  // Blog has many BlogTags
  Blog.hasMany(BlogTag, { foreignKey: 'blogId' });

  // BlogTag belongs to Tag
  BlogTag.belongsTo(Tag, { as: 'tags', foreignKey: 'tagId' });

  // Optionally, you can also set up the many-to-many relationship between Blog and Tag:
  Blog.belongsToMany(Tag, {
    through: BlogTag,
    foreignKey: 'blogId',
    otherKey: 'tagId',
  });

  Tag.belongsToMany(Blog, {
    through: BlogTag,
    foreignKey: 'tagId',
    otherKey: 'blogId',
  });
}

module.exports = initAssociations;