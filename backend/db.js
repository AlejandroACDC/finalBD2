const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// Conexión a PostgreSQL con Sequelize
const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('🔌 Conectado a PostgreSQL con Sequelize'))
  .catch(err => console.error('Error al conectar con PostgreSQL', err));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🔌 Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB', err));

module.exports = { sequelize, mongoose };
