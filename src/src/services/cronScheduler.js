const cron = require('node-cron')
const sendEmail = require('./sendemail') // Importa la función de envío de correo

// Función para iniciar el cron job
const startEmailCronJob = () => {
    cron.schedule('* * * * *', async () => { 
        console.log('Ejecutando la tarea de envío de correo...')
        try {
            const templateData = {
                message: "Este correo es una prueba de la separación de templates. ¡Todo va genial!"
            }

            await sendEmail(
                [ 
                    "lt726875@gmail.com",
                    // "yorluis.vega@gmail.com"
                ],
                "Este es un Correo de prueba programado desde Node.js usando CronJob",
                templateData
            )
            console.log('Correo programado enviado exitosamente.')
        } catch (error) {
            console.error('Error al ejecutar la tarea de cron y enviar correo:', error)
        }
    }, {
        timezone: "America/Bogota" // Asegúrate de que el cron use la misma zona horaria
    })
    console.log('Aplicación de CronJob iniciada. Esperando la próxima ejecución...')
}

module.exports = startEmailCronJob