const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const authRouter = require('./Routes/auth.routes.js')
const interviewRouter = require('./Routes/interview.routes.js')

app.use('/api/user', authRouter)
app.use('/api/interview', interviewRouter)

const PORT = process.env.PORT || 3000

module.exports = app;