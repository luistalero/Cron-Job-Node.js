const cron = require('node-cron')
const sendEmail = require('./sendemail') // Importa la función de envío de correo
const { getPendingEmailsToSend, updateEmailStatus } = require('../database/db') // Importa las nuevas funciones de DB

// Función para iniciar el cron job
const startEmailCronJob = () => {
    // Este cron job se ejecutará cada minuto. Puedes ajustarlo según tu necesidad.
    cron.schedule('* * * * *', async () => { 
        console.log('Ejecutando la tarea de revisión de correos programados...')

        try {
            const emailsToSend = await getPendingEmailsToSend()
            
            if (emailsToSend.length === 0) {
                console.log('No hay correos programados pendientes para enviar en este momento.')
                return
            }

            console.log(`Encontrados ${emailsToSend.length} correos para enviar.`)

            for (const email of emailsToSend) {
                try {
                    // El campo 'recipients' de la BD ya es un array de strings de correos gracias a JSON.parse en db.js
                    const recipients = email.recipients 
                    const subject = email.subject
                    const body = email.body // Asumimos que el body ya es el HTML o el contenido para la plantilla

                    // Asegúrate de que 'sendEmail' pueda manejar el 'body' como HTML directo o como datos para una plantilla
                    await sendEmail(
                        recipients,        // Aquí se pasan los destinatarios del array
                        subject,
                        { message: body }  // Si 'sendEmail' usa una plantilla, pasamos el 'body' como 'message'
                                           // Si 'sendEmail' espera el HTML directo, podrías pasar `body` directamente como HTML
                                           // pero tu `sendEmail` actual usa `generateTestEmailTemplate`
                    )
                    
                    await updateEmailStatus(email.id, 'sent', new Date())
                    console.log(`Correo ${email.id} enviado exitosamente a: ${recipients.join(', ')}.`)
                } catch (emailError) {
                    console.error(`Error al enviar el correo ${email.id}:`, emailError)
                    await updateEmailStatus(email.id, 'failed') // Marcar como fallido
                }
            }
            console.log('Proceso de envío de correos programados finalizado.')
        } catch (error) {
            console.error('Error al ejecutar la tarea de cron y procesar correos:', error)
        }
    }, {
        timezone: "America/Bogota" // Asegúrate de que el cron use la misma zona horaria
    })
    console.log('Aplicación de CronJob iniciada. Esperando la próxima ejecución para revisar correos programados...')
}

module.exports = startEmailCronJob
