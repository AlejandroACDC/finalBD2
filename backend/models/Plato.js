const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Plato = sequelize.define('Plato', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.FLOAT, allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
  alergenos: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] } // <-- NUEVO CAMPO
}, {
  tableName: 'Platos',
  timestamps: false
});

module.exports = Plato;