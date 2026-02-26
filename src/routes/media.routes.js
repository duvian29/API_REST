const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 1. Obtener todas las producciones 
router.get('/', (req, res) => {
    const sql = `
        SELECT m.*, g.nombre AS genero, d.nombres AS director, p.nombre AS productora, t.nombre AS tipo
        FROM media m
        JOIN genero g ON m.genero_id = g.id
        JOIN director d ON m.director_id = d.id
        JOIN productora p ON m.productora_id = p.id
        JOIN tipo t ON m.tipo_id = t.id`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//  producción por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT m.*, g.nombre AS genero, d.nombres AS director, 
        p.nombre AS productora, t.nombre AS tipo
        FROM media m
        JOIN genero g ON m.genero_id = g.id
        JOIN director d ON m.director_id = d.id
        JOIN productora p ON m.productora_id = p.id
        JOIN tipo t ON m.tipo_id = t.id
        WHERE m.id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Producción no encontrada" });
        }
        res.json(results[0]);
    });
});

// 2. Crear producción 
router.post('/', (req, res) => {
    const { serial, titulo, sinopsis, url_pelicula, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id } = req.body;

    const sqlCheck = `SELECT 
            (SELECT estado FROM genero WHERE id = ?) AS gen,
            (SELECT estado FROM director WHERE id = ?) AS dir,
            (SELECT estado FROM productora WHERE id = ?) AS prod`;

    db.query(sqlCheck, [genero_id, director_id, productora_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const r = results[0];
        
        if (!r.gen || !r.dir || !r.prod) {
            return res.status(404).json({ message: "Uno de los IDs (Género, Director o Productora) no existe." });
        }

        if (r.gen !== 'Activo' || r.dir !== 'Activo' || r.prod !== 'Activo') {
            return res.status(400).json({ message: "Género, Director o Productora no están activos." });
        }

        const sqlInsert = `INSERT INTO media (serial, titulo, sinopsis, url_pelicula, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        db.query(sqlInsert, [serial, titulo, sinopsis, url_pelicula, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Producción creada', id: result.insertId });
        });
    });
});

// 3. Actualizar producción 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { serial, titulo, sinopsis, url_pelicula, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id } = req.body;

    const sql = `UPDATE media SET serial=?, titulo=?, sinopsis=?, url_pelicula=?, imagen_portada=?, anio_estreno=?, genero_id=?, director_id=?, productora_id=?, tipo_id=? WHERE id=?`;
    
    db.query(sql, [serial, titulo, sinopsis, url_pelicula, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Producción no encontrada" });
        res.json({ message: "Producción actualizada correctamente" });
    });
});

// 4. ELIMINAR PRODUCCIÓN 
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM media WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró la producción con el ID: " + id });
        }
        res.json({ message: "Producción eliminada correctamente" });
    });
});

module.exports = router;