const express = require('express');
const router = express.Router();
const Reservacion = require('../models/Reservacion');

// Obtener reservas filtradas por fecha y/o cliente
router.get('/', async (req, res) => {
    try {
        const { fecha, cliente_id } = req.query;
        const where = {};
        if (fecha) where.fecha = fecha;
        if (cliente_id) where.cliente_id = cliente_id;
        const reservaciones = await Reservacion.findAll({ where });
        res.json(reservaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una reservación por ID
router.get('/:id', async (req, res) => {
    try {
        const reservacion = await Reservacion.findByPk(req.params.id);
        if (!reservacion) return res.status(404).json({ error: 'Reservación no encontrada' });
        res.json(reservacion);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear una nueva reservación con validación de disponibilidad
router.post('/', async (req, res) => {
    const { cliente_id, mesa_id, fecha, hora } = req.body;
    try {
        // Buscar reservas en la misma mesa y fecha dentro del rango de 2 horas antes y después
        const horaReserva = hora; // formato "HH:mm:ss" o "HH:mm"
        const fechaReserva = fecha; // formato "YYYY-MM-DD"

        // Calcular el rango de horas prohibidas
        const [h, m] = horaReserva.split(":").map(Number);
        const horaInicio = `${String(h - 2).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
        const horaFin = `${String(h + 2).padStart(2, "0")}:${String(m).padStart(2, "0")}:59`;

        // Buscar si existe alguna reserva en ese rango
        const existe = await Reservacion.findOne({
            where: {
                mesa_id,
                fecha: fechaReserva,
                hora: {
                    [require('sequelize').Op.between]: [horaInicio, horaFin]
                }
            }
        });

        if (existe) {
            return res.status(400).json({ mensaje: 'La mesa no está disponible (Intente reservar 2 horas antes o despues)' });
        }

        const nuevaReservacion = await Reservacion.create({ cliente_id, mesa_id, fecha, hora });
        res.status(201).json(nuevaReservacion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Actualizar una reservación
router.put('/:id', async (req, res) => {
    const { cliente_id, mesa_id, fecha, hora } = req.body;
    try {
        const reservacion = await Reservacion.findByPk(req.params.id);
        if (!reservacion) return res.status(404).json({ error: 'Reservación no encontrada' });
        await reservacion.update({ cliente_id, mesa_id, fecha, hora });
        res.json(reservacion);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una reservación
router.delete('/:id', async (req, res) => {
    try {
        const reservacion = await Reservacion.findByPk(req.params.id);
        if (!reservacion) return res.status(404).json({ error: 'Reservación no encontrada' });
        await reservacion.destroy();
        res.json({ message: 'Reservación eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Validar disponibilidad de mesa
router.post('/validar', async (req, res) => {
    const { mesa_id, fecha, hora } = req.body;
    try {
        const existe = await Reservacion.findOne({
            where: { mesa_id, fecha, hora }
        });
        res.json({ disponible: !existe });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;