// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { sequelize } = require('./db'); // Usar sequelize, no pool

const clientesRouter = require('./routes/clientes');
const opinionesRouter = require('./routes/opiniones');
const mesasRouter = require('./routes/mesas');
const reservsasRouter = require('./routes/reservas');
const platosRouter = require('./routes/platos');
const pedidosRouter = require('./routes/pedidos');
const preferenciasRouter = require('./routes/preferencias');

const Pedido = require('./models/Orden');
const Plato = require('./models/Plato');
const Cliente = require('./models/Cliente');
const PedidoPlato = require('./models/PedidoPlato');

// Asociaciones
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Pedido.belongsToMany(Plato, { through: PedidoPlato, foreignKey: 'pedido_id' });
Plato.belongsToMany(Pedido, { through: PedidoPlato, foreignKey: 'plato_id' });

app.use(cors());            // Permite peticiones cross-origin del frontend
app.use(express.json());    // Permite parsear JSON en body

// Rutas API
app.use('/api/clientes', clientesRouter);
app.use('/api/opiniones', opinionesRouter);
app.use('/api/mesas', mesasRouter);
app.use('/api/reservas', reservsasRouter);
app.use('/api/platos', platosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/preferencias', preferenciasRouter);

// Sincronizar modelos y arrancar servidor
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en puerto ${PORT}`);
  });
});