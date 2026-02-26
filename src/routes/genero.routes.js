const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {

    db.query('SELECT * FROM genero', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre, estado, descripcion } = req.body;

    const sql = 'INSERT INTO genero (nombre, estado, descripcion) VALUES (?, ?, ?)';

    db.query(sql, [nombre, estado, descripcion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Género creado', id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, estado, descripcion } = req.body;

    const sql = 'UPDATE genero SET nombre=?, estado=?, descripcion=? WHERE id=?';

    db.query(sql, [nombre, estado, descripcion, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Género actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM genero WHERE id = ?',
        [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Género eliminado' });
    });
});

module.exports = router;