import express from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { isSeller } from '../middleware/roleMiddleware.js'

const productRoutes = express.Router()

productRoutes.get('/', getProducts)
productRoutes.get('/:id', getProductById)
productRoutes.post('/', authenticateToken , isSeller, createProduct)
productRoutes.patch('/:id', authenticateToken , isSeller, updateProduct)
productRoutes.delete('/:id', authenticateToken , isSeller, deleteProduct)

export default productRoutes