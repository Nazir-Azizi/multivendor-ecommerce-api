import db from '../lib/db.js';

export async function getStores(req, res) {
    try {
        const stores = await db.store.findMany()
        return res.status(200).json(stores)
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function getStoreById(req, res) {
    const storeId = Number(req.params.id)
    try {
        const store = await db.store.findFirst({
            where: {
                id: storeId
            }
        })
        return res.status(200).json(store)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function createStore(req, res) {
    const { name, description } = req.body
    if (!name)
        return res.status(400).json({ message: 'Missing required fields' })
    const userId = req.userId
    try {
        await db.user.update({
            where: {
                id: userId
            }, 
            data: {
                role: 1
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
    try {
        await db.store.create({
            data: {
                name: name.trim(),
                description: description ? description.trim() : description,
                owner_id: userId
            }
        })
        return res.status(201).json({ message: 'Created' })
    } catch (error) {
        try {
            await db.user.update({
                where: {
                    id: userId
                }, 
                data: {
                    role: 0
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
        }
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function updateStore(req, res) {
    const storeId = Number(req.params.id)
    const userId = req.body.userId
    try {
        const store = await db.store.findFirst({
            where: {
                id: storeId,
                owner_id: userId
            }
        })
        if (!store) 
            return res.status(404).json({ message: 'The server can not find the requested resource' })

        let { name, description} = req.body

        if (!name)
            return res.status(400).json({ message: 'Missing required fields' })

        await db.store.update({
            where: {
                id: storeId
            }, 
            data: {
                name: name.trim(),
                description: description ? description.trim() : description
            }
        })
        res.status(200).json({ message: 'Updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function deleteStore(req, res) {
    const storeId = Number(req.params.id)
    const userId = req.userId 
    try {
        const store = await db.store.findFirst({
            where: {
                id: storeId,
                owner_id: userId
            }
        })

        if (!store)
            return res.status(400).json({ message: 'The server can not find the requested resource' })
        await db.store.delete({
            where: {
                id: storeId
            }
        })
        await db.user.update({
            where: {
                id: userId
            }, 
            data: {
                role: 0
            }
        })
        res.status(200).json({ message: 'DELETED' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}