require('dotenv').config()
const app = require('./config/express') 
const { connectDB } = require('./database/db')
const startEmailCronJob = require('./services/cronScheduler')

const appRoutes = require('./routes/appRoutes')

const PORT = process.env.PORT || 3000

// Conexión a la base de datos
connectDB()

// Iniciar el cron job
startEmailCronJob()

// Usar las rutas
app.use('/', appRoutes)

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})