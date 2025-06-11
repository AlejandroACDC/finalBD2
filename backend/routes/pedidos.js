const express = require('express');
const router = express.Router();
const Pedido = require('../models/Orden');
const Plato = require('../models/Plato');
const Cliente = require('../models/Cliente');
const PedidoPlato = require('../models/PedidoPlato');

// Obtener todos los pedidos o filtrados por fecha y/o cliente
router.get('/', async (req, res) => {
    try {
        const where = {};
        if (req.query.cliente_id) where.cliente_id = req.query.cliente_id;
        if (req.query.fecha) where.fecha = req.query.fecha;

        const pedidos = await Pedido.findAll({
            where,
            include: [
                {
                    model: Plato,
                    through: { attributes: ['cantidad'] }
                },
                {
                    model: Cliente
                }
            ]
        });
        res.json(pedidos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Obtener un pedido por ID con sus platos
router.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: {
                model: Plato,
                through: { attributes: ['cantidad'] }
            }
        });
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo pedido con platos asociados
router.post('/', async (req, res) => {
    const { cliente_id, fecha, platos } = req.body; // platos: [{ plato_id, cantidad }]
    try {
        if (!cliente_id || !fecha || !Array.isArray(platos) || platos.length === 0) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        // 1. Obtener los precios de los platos
        const platosDB = await Plato.findAll({
            where: { id: platos.map(p => p.plato_id) }
        });

        // 2. Calcular el total
        let total = 0;
        for (const p of platos) {
            const platoInfo = platosDB.find(pl => pl.id === p.plato_id);
            if (platoInfo) {
                total += platoInfo.precio * p.cantidad;
            }
        }

        // 3. Crear el pedido con total
        const nuevoPedido = await Pedido.create({ cliente_id, fecha, total });

        // 4. Asociar los platos al pedido
        for (const p of platos) {
            await PedidoPlato.create({
                pedido_id: nuevoPedido.id,
                plato_id: p.plato_id,
                cantidad: p.cantidad
            });
        }

        res.status(201).json({ mensaje: "Pedido creado", pedido_id: nuevoPedido.id });
    } catch (err) {
        console.error("Error al crear pedido:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar un pedido
router.put('/:id', async (req, res) => {
    const { cliente_id, fecha, total } = req.body;
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        await pedido.update({ cliente_id, fecha, total });
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar un pedido
router.delete('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        await pedido.destroy();
        res.json({ message: 'Pedido eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;