const express = require('express');
const router = express.Router();
const Plato = require('../models/Plato');

// Obtener todos los platos o filtrados por nombre, categoría o disponibilidad
router.get('/', async (req, res) => {
    try {
        const { nombre, categoria, disponible } = req.query;
        const where = {};
        if (nombre) where.nombre = nombre;
        if (categoria) where.categoria = categoria;
        if (disponible !== undefined) where.disponible = disponible === 'true';
        const platos = await Plato.findAll({ where });
        res.json(platos);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener un plato por ID
router.get('/:id', async (req, res) => {
    try {
        const plato = await Plato.findByPk(req.params.id);
        if (!plato) return res.status(404).json({ error: 'Plato no encontrado' });
        res.json(plato);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo plato
router.post('/', async (req, res) => {
    const { nombre, categoria, precio, disponible } = req.body;
    try {
        const nuevoPlato = await Plato.create({ nombre, categoria, precio, disponible });
        res.status(201).json(nuevoPlato);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar un plato
router.put('/:id', async (req, res) => {
    const { nombre, categoria, precio, disponible } = req.body;
    try {
        const plato = await Plato.findByPk(req.params.id);
        if (!plato) return res.status(404).json({ error: 'Plato no encontrado' });
        await plato.update({ nombre, categoria, precio, disponible });
        res.json(plato);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar un plato
router.delete('/:id', async (req, res) => {
    try {
        const plato = await Plato.findByPk(req.params.id);
        if (!plato) return res.status(404).json({ error: 'Plato no encontrado' });
        await plato.destroy();
        res.json({ message: 'Plato eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;