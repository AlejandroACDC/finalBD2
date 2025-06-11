const express = require('express');
const router = express.Router();
const Opinion = require('../models/Opinion');

// Obtener todas las opiniones, con filtros opcionales
router.get('/', async (req, res) => {
    try {
        const { tipoVisita, calificacion, plato } = req.query;
        const filtro = {};
        if (tipoVisita) filtro.tipoVisita = tipoVisita;
        if (calificacion) filtro.calificacion = Number(calificacion);
        if (plato) filtro.platos = { $in: [plato] };

        const opiniones = await Opinion.find(filtro);
        res.json(opiniones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Crear una nueva opinión
router.post('/', async (req, res) => {
    const opinion = new Opinion({
        comentario: req.body.comentario,
        calificacion: req.body.calificacion,
        clienteId: req.body.clienteId,
        tipoVisita: req.body.tipoVisita,
        fecha: req.body.fecha,
        platos: req.body.platos
    });

    try {
        const nuevaOpinion = await opinion.save();
        res.status(201).json(nuevaOpinion);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Obtener una opinión por ID
router.get('/:id', async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);
        if (!opinion) return res.status(404).json({ mensaje: 'Opinión no encontrada' });
        res.json(opinion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Actualizar una opinión por ID
router.patch('/:id', async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);
        if (!opinion) return res.status(404).json({ mensaje: 'Opinión no encontrada' });

        if (req.body.comentario) opinion.comentario = req.body.comentario;
        if (req.body.calificacion) opinion.calificacion = req.body.calificacion;
        if (req.body.clienteId) opinion.clienteId = req.body.clienteId;
        if (req.body.tipoVisita) opinion.tipoVisita = req.body.tipoVisita;
        if (req.body.fecha) opinion.fecha = req.body.fecha;
        if (req.body.platos) opinion.platos = req.body.platos;

        const opinionActualizada = await opinion.save();
        res.json(opinionActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Eliminar una opinión por ID
router.delete('/:id', async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id);
        if (!opinion) return res.status(404).json({ mensaje: 'Opinión no encontrada' });

        await opinion.remove();
        res.json({ mensaje: 'Opinión eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;