const transporter = require('../config/nodemailerConfig')
const generateTestEmailTemplate = require('./Templates/testEmailTmplate')

async function sendEmail(to, subject, dataForTemplates = {}) {
    try {
        const emailHtml = generateTestEmailTemplate(dataForTemplates)
        
        let mailOptions = {
            from: `"Luis Talero" <${process.env.EMAIL_USER}>`, // Asegúrate que EMAIL_USER esté disponible desde .env
            to: to,
            subject: subject,
            html: emailHtml,
        }

        let info = await transporter.sendMail(mailOptions)

        console.log("Correo enviado: %s", info.messageId)
        return info
    } catch (error) {
        console.error("Error al enviar el correo:", error)
        throw error
    }
}

module.exports = sendEmail
