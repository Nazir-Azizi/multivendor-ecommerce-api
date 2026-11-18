import express from 'express'
import authRouter from './routes/authRouter.js'

const app = express()

app.use('/auth', authRouter)


export default app