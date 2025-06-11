const express = require('express');
const router = express.Router();
const Recomendacion = require('../models/Recomendaciones');
const Preferencia = require('../models/Preferencias'); // Asegúrate de tener este modelo
const Plato = require('../models/Plato'); // CORRECTO

// Obtener todas las recomendaciones
router.get('/', async (req, res) => {
    try {
        const recomendaciones = await Recomendacion.find();
        res.json(recomendaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Crear una nueva recomendación
router.post('/', async (req, res) => {
    const recomendacion = new Recomendacion({
        clienteId: req.body.clienteId,
        sugerencias: req.body.sugerencias,
        motivo: req.body.motivo
    });
    try {
        const nuevaRecomendacion = await recomendacion.save();
        res.status(201).json(nuevaRecomendacion);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Sugerencias personalizadas para un cliente (debe ir antes que /:clienteId)
router.get('/:clienteId/sugerencias', async (req, res) => {
    try {
        const preferencia = await Preferencia.findOne({ clienteId: req.params.clienteId });
        if (!preferencia) return res.json([]);

        let where = { disponible: true };
        // Si hay estilos, busca todos los que coincidan
        if (preferencia.estilos && preferencia.estilos.length > 0 && preferencia.estilos[0].trim() !== "") {
            where.categoria = preferencia.estilos.length === 1
                ? preferencia.estilos[0]
                : { [require('sequelize').Op.in]: preferencia.estilos };
        }

        let platos = await Plato.findAll({ where });

        // Filtrar platos que NO tengan ningún alérgeno presente en las intolerancias del cliente
        if (preferencia.intolerancias && preferencia.intolerancias[0] && preferencia.intolerancias[0].trim() !== "") {
            platos = platos.filter(plato =>
                Array.isArray(plato.alergenos) &&
                !plato.alergenos.some(alergeno =>
                    preferencia.intolerancias.includes(alergeno)
                )
            );
        }

        await Recomendacion.create({
            clienteId: preferencia.clienteId,
            sugerencias: platos.map(p => p.nombre),
            motivo: 'Generadas automáticamente por preferencias'
        });

        // Al final de la ruta:
        res.json(platos.map(p => p.nombre)); // <-- Solo nombres, no objetos
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;