import express from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import authenticateRole from '../middleware/roleMiddleware.js'

const productRoutes = express.Router()

productRoutes.get('/', getProducts)
productRoutes.get('/:id', getProductById)
productRoutes.post('/', authenticateToken , authenticateRole, createProduct)
productRoutes.patch('/:id', authenticateToken , authenticateRole, updateProduct)
productRoutes.delete('/:id', authenticateToken , authenticateRole, deleteProduct)

export default productRoutes