const express = require('express')
const dotenv = require('dotenv')
const { connectDB } = require('./DB/connect.js')
const app = require('./app')

dotenv.config({ path: './.env' })

const port = process.env.PORT || 3000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err)
        process.exit(1)
    })