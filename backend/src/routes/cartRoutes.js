import express from 'express'
import { addToCart, clearCart, getCart, removeFromCart } from '../controllers/cartController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const cartRoutes = express.Router()

cartRoutes.get('/', authenticateToken, getCart)
cartRoutes.post('/', authenticateToken, addToCart)
cartRoutes.delete('/:id', authenticateToken, removeFromCart)
cartRoutes.post('/', authenticateToken, clearCart)


export default cartRoutes