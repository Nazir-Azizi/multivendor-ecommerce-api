import express from 'express'
import { loginControl, registerControl } from '../controllers/authController.js'

const authRoutes = express.Router()

authRoutes.post('/login', loginControl)
authRoutes.post('/register', registerControl)



export default authRoutes