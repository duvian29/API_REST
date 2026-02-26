const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {

    db.query('SELECT * FROM director', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombres, estado } = req.body;

    db.query('INSERT INTO director (nombres, estado) VALUES (?, ?)', 
        [nombres, estado], (err, result) => {

        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Director creado', id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { nombres, estado } = req.body;

    db.query('UPDATE director SET nombres=?, estado=? WHERE id=?', 
        [nombres, estado, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Director actualizado' });
    });
});

router.delete('/:id', (req, res) => {

    db.query('DELETE FROM director WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Director eliminado' });
    });
});

module.exports = router;