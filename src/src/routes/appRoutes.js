const express = require('express')
const router = express.Router()
const { insertScheduledEmail, getAllUsers } = require('../database/db')

router.get('/', (req, res) => {
    res.send('¡API de Programación de Correos funcionando! El CronJob está activo y esperando correos programados.')
})

router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.', error: error.message })
    }
})

router.post('/schedule-email', async (req, res) => {
    const { userId, to, subject, body, scheduledTime } = req.body 
    
    if (!userId || !to || !Array.isArray(to) || to.length === 0 || !subject || !body || !scheduledTime) {
        return res.status(400).json({ message: 'Faltan campos obligatorios o formato incorrecto: userId (ID del remitente), to (array de emails destinatarios), subject, body, scheduledTime' })
    }

    try {
        const emailId = await insertScheduledEmail(userId, subject, body, new Date(scheduledTime), to)
        res.status(201).json({ 
            message: 'Correo programado exitosamente.', 
            emailId: emailId,
            details: {
                userId,
                subject,
                recipients: to,
                scheduledTime
            }
        })
    } catch (error) {
        console.error('Error al programar el correo:', error)
        res.status(500).json({ message: 'Error interno del servidor al programar el correo.', error: error.message })
    }
})

module.exports = router
