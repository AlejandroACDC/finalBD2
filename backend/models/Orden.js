const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Pedido = sequelize.define('Pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: 'pedidos',
  timestamps: false
});

module.exports = Pedido;