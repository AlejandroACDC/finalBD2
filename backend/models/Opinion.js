const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
    comentario: { type: String, required: true },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    clienteId: { type: Number, required: true }, // <-- debe ser Number
    tipoVisita: { type: String, enum: ['familiar', 'negocios', 'pareja', 'otro'], required: true },
    fecha: { type: Date, default: Date.now },
    platos: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Opinion', opinionSchema);