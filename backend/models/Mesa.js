const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Mesa = sequelize.define('Mesa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  capacidad: { type: DataTypes.INTEGER, allowNull: false },
  ubicacion: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'mesas',
  timestamps: false
});

module.exports = Mesa;