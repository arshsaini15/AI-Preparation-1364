const { authenticateUser } = require('../Middlewares/auth.js')
const {createInterview ,updateInterviewController, deleteInterviewController, fetchInterviewsController, startInterviewController, answerInterviewController } = require('../Controllers/Interviews.controller.js')

const {Router} = require('express')
const router = Router()

router.post('/create', authenticateUser, createInterview)
router.put('/update/:id', authenticateUser, updateInterviewController)
router.delete('/delete/:id', authenticateUser, deleteInterviewController)
router.get('/mine', authenticateUser, fetchInterviewsController)
router.post('/start', authenticateUser, startInterviewController)
router.post('/answer', authenticateUser, answerInterviewController)

module.exports = router