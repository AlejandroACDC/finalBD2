const express = require('express');
const router = express.Router();
const Preferencia = require('../models/Preferencias');
const Plato = require('../models/Plato');

// Obtener todas las preferencias
router.get('/', async (req, res) => {
    try {
        const preferencias = await Preferencia.find();
        res.json(preferencias);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Crear una nueva preferencia
router.post('/', async (req, res) => {
    const preferencia = new Preferencia({
        clienteId: req.body.clienteId,
        intolerancias: req.body.intolerancias,
        platosFavoritos: req.body.platosFavoritos,
        estilos: req.body.estilos
    });
    try {
        const nuevaPreferencia = await preferencia.save();
        res.status(201).json(nuevaPreferencia);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Sugerencias personalizadas para un cliente (debe ir antes que /:clienteId)
router.get('/:clienteId/sugerencias', async (req, res) => {
    try {
        const preferencia = await Preferencia.findOne({ clienteId: req.params.clienteId });
        if (!preferencia) return res.status(404).json({ mensaje: 'Preferencias no encontradas' });

        // Buscar platos que coincidan con estilos y estén disponibles
        let where = {};
        if (preferencia.estilos && preferencia.estilos.length > 0) {
            where.categoria = preferencia.estilos[0]; // Puedes mejorar esto para varios estilos
        }
        where.disponible = true;

        let platos = await Plato.findAll({ where });

        // Filtrar platos que NO tengan ningún alérgeno presente en las intolerancias del cliente
        if (preferencia.intolerancias && preferencia.intolerancias.length > 0) {
            platos = platos.filter(plato =>
                !plato.alergenos.some(alergeno =>
                    preferencia.intolerancias.includes(alergeno)
                )
            );
        }

        res.json(platos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener preferencias de un cliente específico
router.get('/:clienteId', async (req, res) => {
    try {
        const preferencia = await Preferencia.findOne({ clienteId: req.params.clienteId });
        if (!preferencia) return res.status(404).json({ mensaje: 'Preferencias no encontradas' });
        res.json(preferencia);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;