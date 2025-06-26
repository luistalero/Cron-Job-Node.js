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

// Nueva función para obtener todos los usuarios
async function getAllUsers() {
    let connection
    try {
        connection = await getConnection()
        const query = `SELECT id, email, username FROM users`
        const [rows] = await connection.execute(query)
        return rows
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error)
        throw error
    } finally {
        if (connection) connection.release()
    }
}

async function insertScheduledEmail(userId, subject, body, scheduledSendTime, recipients) {
    let connection
    try {
        connection = await getConnection()
        const recipientsJson = JSON.stringify(recipients)
        const query = `
            INSERT INTO scheduled_emails (user_id, subject, body, scheduled_send_time, status, recipients)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        const [result] = await connection.execute(query, [userId, subject, body, scheduledSendTime, recipientsJson, 'pending'])
        console.log('Correo programado guardado en la base de datos. ID:', result.insertId)
        return result.insertId
    } catch (error) {
        console.error('Error al insertar correo programado en la base de datos:', error)
        throw error
    } finally {
        if (connection) connection.release()
    }
}

async function getPendingEmailsToSend() {
    let connection
    try {
        connection = await getConnection()
        const query = `
            SELECT id, user_id, subject, body, scheduled_send_time
            FROM scheduled_emails
            WHERE status = 'pending' AND scheduled_send_time <= NOW()
        `
        const [rows] = await connection.execute(query)
        // Parsear el string JSON de recipients de vuelta a un array para cada fila
        return rows.map(row => ({
            ...row,
            recipients: JSON.parse(row.recipients)
        }))
    } catch (error) {
        console.error('Error al obtener correos pendientes de envío:', error)
        throw error
    } finally {
        if (connection) connection.release()
    }
}

// Función para actualizar el estado de un correo (sin cambios)
async function updateEmailStatus(emailId, status, sentAt = null) {
    let connection
    try {
        connection = await getConnection()
        let query
        let params

        if (sentAt) {
            query = `
                UPDATE scheduled_emails
                SET status = ?, sent_at = ?
                WHERE id = ?
            `
            params = [status, sentAt, emailId]
        } else {
            query = `
                UPDATE scheduled_emails
                SET status = ?
                WHERE id = ?
            `
            params = [status, emailId]
        }
        
        await connection.execute(query, params)
        console.log(`Estado del correo ${emailId} actualizado a: ${status}`)
    } catch (error) {
        console.error(`Error al actualizar el estado del correo ${emailId}:`, error)
        throw error
    } finally {
        if (connection) connection.release()
    }
}


module.exports = {
    connectDB,
    getConnection,
    getAllUsers,               // Exportar la nueva función
    insertScheduledEmail,      // Exportar la función modificada
    getPendingEmailsToSend,    // Exportar la función modificada
    updateEmailStatus          // Exportar la función
}
