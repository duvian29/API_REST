const express = require('express');
require('dotenv').config(); // Carga las variables del archivo .env (Seguridad)
const app = express();

// Importar las rutas de los 5 módulos solicitados
const generoRoutes = require('./src/routes/genero.routes');
const directorRoutes = require('./src/routes/director.routes');
const productoraRoutes = require('./src/routes/productora.routes');
const tipoRoutes = require('./src/routes/tipo.routes');
const mediaRoutes = require('./src/routes/media.routes');

// Middleware para que el servidor entienda JSON
app.use(express.json());

// Definición de las rutas (Endpoints)
app.use('/generos', generoRoutes);
app.use('/directores', directorRoutes);
app.use('/productoras', productoraRoutes);
app.use('/tipos', tipoRoutes);     // <-- Nuevo módulo agregado
app.use('/media', mediaRoutes);    // <-- Nuevo módulo agregado (El corazón del proyecto)

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API REST IU Digital - Gestión de Películas y Series');
});

// Configuración del puerto (Usa el del .env o el 3000 por defecto)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`--- Monolito Activo ---`);
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});