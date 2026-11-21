import express from 'express'
import { createStore, deleteStore, getStoreById, getStores, updateStore } from '../controllers/storeController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { isBuyer, isSeller } from '../middleware/roleMiddleware.js'

const storeRoutes = express.Router()

storeRoutes.get('/', getStores)
storeRoutes.get('/:id', getStoreById)
storeRoutes.post('/', authenticateToken, isBuyer ,createStore)
storeRoutes.patch('/:id', authenticateToken, isSeller, updateStore)
storeRoutes.delete('/:id', authenticateToken, isSeller, deleteStore)

export default storeRoutes