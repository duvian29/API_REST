const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
    db.query('SELECT * FROM productora', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { nombre, estado, slogan, descripcion } = req.body;

    const sql = 'INSERT INTO productora (nombre, estado, slogan, descripcion) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, estado, slogan, descripcion], (err, result) => {

        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Productora creada', id: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { nombre, estado, slogan, descripcion } = req.body;

    const sql = 'UPDATE productora SET nombre=?, estado=?, slogan=?, descripcion=? WHERE id=?';

    db.query(sql, [nombre, estado, slogan, descripcion, req.params.id], (err) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Productora actualizada' });
    });
});

router.delete('/:id', (req, res) => {

    db.query('DELETE FROM productora WHERE id = ?', [req.params.id], (err) => {
        
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Productora eliminada' });
    });
});

module.exports = router;