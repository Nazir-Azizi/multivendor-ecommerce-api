import express from 'express'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api/product', productRoutes)


export default app