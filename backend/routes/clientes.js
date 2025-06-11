const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
    const { nombre, correo, telefono } = req.body;
    try {
        console.log("Intentando crear cliente:", req.body); // <-- LOG
        const nuevoCliente = await Cliente.create({ nombre, correo, telefono });
        res.status(201).json(nuevoCliente);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
    const { nombre, correo, telefono } = req.body;
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        await cliente.update({ nombre, correo, telefono });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        await cliente.destroy();
        res.json({ message: 'Cliente eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
  const { nombre, correo, telefono, password } = req.body;
  console.log("Intentando registrar:", req.body); // <-- LOG
  if (!nombre || !correo || !telefono || !password) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const existe = await Cliente.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });
    const cliente = await Cliente.create({ nombre, correo, telefono, password });
    res.json({ id: cliente.id, nombre: cliente.nombre, correo: cliente.correo, telefono: cliente.telefono });
  } catch (err) {
    console.error("Error al registrar cliente:", err);
    res.status(500).json({ error: 'Error al registrar', detalle: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const cliente = await Cliente.findOne({ where: { correo } });
    if (!cliente) return res.status(400).json({ error: 'Correo no registrado' });
    if (cliente.password !== password) return res.status(400).json({ error: 'Contraseña incorrecta' });
    res.json({ cliente: { id: cliente.id, nombre: cliente.nombre, correo: cliente.correo, telefono: cliente.telefono } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;