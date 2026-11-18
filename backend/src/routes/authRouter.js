import express from 'express'
import { loginControl, registerControl } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.post('/login', loginControl)
authRouter.post('/register', registerControl)



export default authRouter