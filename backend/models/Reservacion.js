const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Reservacion = sequelize.define('Reservacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  mesa_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false }
}, {
  tableName: 'reservaciones',
  timestamps: false
});

module.exports = Reservacion;