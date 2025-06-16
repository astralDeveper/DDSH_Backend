const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Service = sequelize.define('Service', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  head1: DataTypes.STRING,
  desc1: DataTypes.STRING,
  head2: DataTypes.STRING,
  desc2: DataTypes.STRING,
  head3: DataTypes.STRING,
  desc3: DataTypes.STRING,
  stage1_head: DataTypes.STRING,
  stage1_desc: DataTypes.STRING,
  stage2_head: DataTypes.STRING,
  stage2_desc: DataTypes.STRING,
  stage3_head: DataTypes.STRING,
  stage3_desc: DataTypes.STRING,
  stage4_head: DataTypes.STRING,
  stage4_desc: DataTypes.STRING,
  stage5_head: DataTypes.STRING,
  stage5_desc: DataTypes.STRING,
  stage6_head: DataTypes.STRING,
  stage6_desc: DataTypes.STRING,
  stage7_head: DataTypes.STRING,
  stage7_desc: DataTypes.STRING,
  img1: DataTypes.STRING,
  img2: DataTypes.STRING,
  img3: DataTypes.STRING,
  img4: DataTypes.STRING,
  img5: DataTypes.STRING,
  img6: DataTypes.STRING,
  img7: DataTypes.STRING,
  img8: DataTypes.STRING,
}, {
  timestamps: true,
  tableName: 'services'
});

module.exports = Service;