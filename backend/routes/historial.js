const express = require('express');
const router = express.Router();
const Historial = require('../models/historial');

// Obtener todos los historiales
router.get('/', async (req, res) => {
    try {
        const historiales = await Historial.find();
        res.json(historiales);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Crear un nuevo historial
router.post('/', async (req, res) => {
    const historial = new Historial({
        clienteId: req.body.clienteId,
        pedidos: req.body.pedidos
    });
    try {
        const nuevoHistorial = await historial.save();
        res.status(201).json(nuevoHistorial);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Buscar historial por cliente, plato o fecha
router.get('/buscar', async (req, res) => {
    try {
        const { clienteId, plato, fecha } = req.query;
        let filtro = {};

        if (clienteId) filtro.clienteId = clienteId;

        // Buscar por clienteId primero
        let historiales = await Historial.find(filtro);

        // Si se busca por plato o fecha, filtrar en memoria (por la estructura del modelo)
        if (plato || fecha) {
            historiales = historiales.map(hist => {
                const pedidosFiltrados = hist.pedidos.filter(pedido => {
                    const coincideFecha = fecha ? (pedido.fecha && pedido.fecha.toISOString().slice(0,10) === fecha) : true;
                    const coincidePlato = plato
                        ? pedido.platos.some(pl => pl.nombre && pl.nombre.toLowerCase().includes(plato.toLowerCase()))
                        : true;
                    return coincideFecha && coincidePlato;
                });
                return { ...hist.toObject(), pedidos: pedidosFiltrados };
            }).filter(hist => hist.pedidos.length > 0);
        }

        res.json(historiales);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;