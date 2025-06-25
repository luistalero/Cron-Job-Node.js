const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.send('¡API de Programación de Correos funcionando! El CronJob está activo.')
})

module.exports = router