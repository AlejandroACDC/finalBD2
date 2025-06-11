const mongoose = require('mongoose');

const recomendacionesSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    sugerencias: [String],
    motivo: String
});

module.exports = mongoose.model('Recomendacion', recomendacionesSchema);