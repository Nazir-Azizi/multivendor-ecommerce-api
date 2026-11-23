import express from 'express'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import storeRoutes from './routes/storeRoute.js'
import cartRoutes from './routes/cartRoutes.js'

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/cart', cartRoutes)


export default app