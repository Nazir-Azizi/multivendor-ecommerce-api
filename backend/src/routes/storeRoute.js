import express from 'express'
import { createStore, getStoreById, getStores } from '../controllers/storeController.js'

const storeRoutes = express.Router()

storeRoutes.get('/', getStores)
storeRoutes.get('/:id', getStoreById)
storeRoutes.post('/', createStore)

export default storeRoutes