// Nuestras dependencias
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Las rutas API
const api = require('./server/routes/api');

// Creación de la aplicación EXPRESS
const app = express();

// Para parsear peticiones POST en el futuro
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Apuntar el PATH a nuestra carpeta DIST
app.use(express.static(path.join(__dirname, 'dist')));

// Setteando la ruta de nuestra API
app.use('/api', api);

// En nuestra app, siempre devolver nuestro INDEX en cualquier ruta
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/*** * * * * * * * * * ***/
/**
 * Asignamos el puerto para la app de EXPRESS
 */
const port = process.env.PORT || '4000';
app.set('port', port);

/**
 * Creando el Servidor HTTP...
 */
const server = http.createServer(app);

/**
 * Puerto abierto en el 4000 
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));