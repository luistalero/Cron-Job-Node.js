require('dotenv').config()
const app = require('./config/express') 
const { connectDB } = require('./database/db')
const startEmailCronJob = require('./services/cronScheduler')

const appRoutes = require('./routes/appRoutes')

const PORT = process.env.PORT || 3001

connectDB()

startEmailCronJob()

app.use('/', appRoutes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})