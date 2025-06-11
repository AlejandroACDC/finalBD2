const express = require('express');
const router = express.Router();
const Mesa = require('../models/Mesa');

// Obtener todas las mesas
router.get('/', async (req, res) => {
    try {
        const mesas = await Mesa.findAll();
        res.json(mesas);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una mesa por ID
router.get('/:id', async (req, res) => {
    try {
        const mesa = await Mesa.findByPk(req.params.id);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
        res.json(mesa);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear una nueva mesa
router.post('/', async (req, res) => {
    const { capacidad, ubicacion } = req.body;
    try {
        const nuevaMesa = await Mesa.create({ capacidad, ubicacion });
        res.status(201).json(nuevaMesa);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar una mesa
router.put('/:id', async (req, res) => {
    const { capacidad, ubicacion } = req.body;
    try {
        const mesa = await Mesa.findByPk(req.params.id);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
        await mesa.update({ capacidad, ubicacion });
        res.json(mesa);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una mesa
router.delete('/:id', async (req, res) => {
    try {
        const mesa = await Mesa.findByPk(req.params.id);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
        await mesa.destroy();
        res.json({ message: 'Mesa eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;