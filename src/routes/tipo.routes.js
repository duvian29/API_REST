const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {

    db.query('SELECT * FROM tipo', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre, descripcion } = req.body;

    db.query('INSERT INTO tipo (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err, result) => {

        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Tipo creado', id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { nombre, descripcion } = req.body;

    db.query('UPDATE tipo SET nombre=?, descripcion=? WHERE id=?', [nombre, descripcion, req.params.id], (err) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tipo actualizado' });
    });
});

router.delete('/:id', (req, res) => {

    db.query('DELETE FROM tipo WHERE id = ?', [req.params.id], (err) => {
        
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tipo eliminado' });
    });
});

module.exports = router;