const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    pedidos: [{
        fecha: Date,
        platos: [{
            nombre: String,
            observaciones: String
        }]
    }]
});

module.exports = mongoose.model('Historial', historialSchema);