const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const PedidoPlato = sequelize.define('PedidoPlato', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  plato_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'pedido_plato',
  timestamps: false
});

module.exports = PedidoPlato;