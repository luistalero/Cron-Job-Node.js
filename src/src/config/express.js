const express = require('express')

const app = express()

// Middlewares generales
app.use(express.json()) // Para parsear JSON en las solicitudes

// Otros middlewares globales si los tienes (ej. CORS, etc.)

module.exports = app