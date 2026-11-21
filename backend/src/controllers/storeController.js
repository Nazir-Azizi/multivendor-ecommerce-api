import db from '../lib/db.js';

export async function getStores(req, res) {
    try {
        const stores = await db.store.findMany()
        return res.status(200).json(stores)
    } catch (error) {
        return res.status(500).json({ message: 'Server failed' })
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
        if (!store)
            return res.status(404).json({ message: 'Store not found' })
        return res.status(200).json(store)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function createStore(req, res) {
    const { name, description, owner_id } = req.body

    if (!name || !owner_id)
         return res.status(400).json({ message: 'Complete all the data for store' })
    try {
        const user = db.user.findFirst({
            where: {
                id: owner_id
            }
        })
        if (!user)
             return res.status(400).json({ message: 'Invalid owner id' })
        await db.user.update({
            where: {
                id: owner_id
            }, 
            data: {
                role: 0
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
    try {
        await db.store.create({
            data: {
                name: name.trim(),
                description: description,
                owner_id: owner_id
            }
        })
        return res.status(201).json({ message: 'Store created' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function updateStore(req, res) {
    const storeId = Number(req.params.id)
    try {
        const store = await db.store.findFirst({
            where: {
                id: storeId
            }
        })
        if (!store) 
            return res.status(400).json({ message: 'No such store' })

        let { name, description} = req.body

        if (!name)
            return res.status(400).json({ message: 'Complete all the data for store' })

        await db.store.update({
            where: {
                id: storeId
            }, 
            data: {
                name: name.trim(),
                description: description
            }
        })
        res.status(200).json({ message: 'Store updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function deleteStore(req, res) {
    const storeId = Number(req.params.id)
    try {
        const store = await db.store.findFirst({
            where: {
                id: storeId
            }
        })

        if (!store)
            return res.status(400).json({ message: 'No such store' })
        await db.store.delete({
            where: {
                id: storeId
            }
        })
        await db.user.update({
            where: {
                id: store.owner_id
            }, 
            data: {
                role: 1
            }
        })
        res.status(200).json({ message: 'Store removed' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}