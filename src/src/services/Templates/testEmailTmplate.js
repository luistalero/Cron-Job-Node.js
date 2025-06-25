const generateTestEmailTemplate = (data = {}) => {
    const { message = "Este es un correo enviado automáticamente mediante un CronJob en Node.js." } = data

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Correo de Prueba Programado</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    width: 80%;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #0056b3;
                }
                p {
                    margin-bottom: 10px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #777;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>¡Hola desde Node.js y CronJob!</h1>
                <p><b>¡Hola!</b> ${message}</p>
                <p>Este es un correo enviado automáticamente mediante un <i>CronJob</i> en Node.js.</p>
                <p>¡Gracias por tu atención!</p>
                <div class="footer">
                    <p>Este correo fue enviado automáticamente. Por favor, no respondas a esta dirección.</p>
                </div>
            </div>
        </body>
        </html>
    `
}

module.exports = generateTestEmailTemplate