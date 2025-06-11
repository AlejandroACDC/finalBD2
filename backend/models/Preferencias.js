const mongoose = require('mongoose');

const preferenciasSchema = new mongoose.Schema({
    clienteId: { type: Number, required: true }, // <-- debe ser Number
    intolerancias: [{ type: String }],
    platosFavoritos: [{ type: String }],
    estilos: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Preferencias', preferenciasSchema);