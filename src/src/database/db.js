const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || "catalinallanes02",
    database: process.env.DB_NAME || 'email_scheduler_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

let pool

async function connectDB() {
    const MAX_RETRIES = 10 
    let currentRetry = 0
    let delay = 3000

    console.log(`Intentando conectar a MariaDB en: ${dbConfig.host}:${3306} como usuario: ${dbConfig.user}, base de datos: ${dbConfig.database}`)

    while (currentRetry < MAX_RETRIES) {
        try {
            if (pool) {
                await pool.end()
                pool = null
            }

            pool = mysql.createPool(dbConfig)
            const connection = await pool.getConnection()
            console.log('✅ Conexión a MariaDB establecida con éxito!')
            connection.release()
            return 
        } catch (error) {
            currentRetry++
            console.error(`❌ Error al conectar con MariaDB (Intento ${currentRetry}/${MAX_RETRIES}): ${error.message}`)
            if (currentRetry < MAX_RETRIES) {
                console.log(`Reintentando en ${delay / 1000} segundos...`)
                await new Promise(resolve => setTimeout(resolve, delay))
                delay = Math.min(delay * 2, 30000) 
            } else {
                console.error('⛔ No se pudo conectar a MariaDB después de varios reintentos. La aplicación se cerrará.')
                process.exit(1)
            }
        }
    }
}

function getConnection() {
    if (!pool) {
        console.error('El pool de conexiones no ha sido inicializado. Asegúrate de llamar a connectDB() y que haya sido exitosa.')
        throw new Error('Database connection pool not initialized.')
    }
    return pool.getConnection()
}

module.exports = {
    connectDB,
    getConnection
}