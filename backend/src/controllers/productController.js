import db from '../lib/db.js';

export async function getProducts(req, res) {
    const storeId = Number(req.query.storeId)

    if (storeId) {
        const products = await db.product.findMany({
            where: {
                store_id: storeId
            }
        })
        if (!products)
            return res.status(404).json({ message: 'The server can not find the requested resource' })
        return res.status(200).json(products)
    } else {
        try {
            const products = await db.product.findMany()
            if (!products)
                return res.status(404).json({ message: 'The server can not find the requested resource' })
            return res.status(200).json(products)
        } catch (error) {
            return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
        }
    }
}

export async function getProductById(req, res) {
    const productId = Number(req.params.id)
    try {
        const product = await db.product.findFirst({
            where: {
                id: productId
            }
        })
        if (!product)
            return res.status(404).json({ message: 'The server can not find the requested resource' })
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function createProduct(req, res) {
    let { name, description, price, stock_quantity } = req.body
    const userInfo = req.body.userInfo
    
    if (!name || !price || !stock_quantity)
        return res.status(400).json({ message: 'Missing required fields' })
    if (price < 0)
        return res.status(400).json({ message: `Invalid value for price ${price}` })
    
    try {
        price = Number(price)
        const store = await db.store.findFirst({
            where: {
                owner_id: userInfo.id
            }
        })
        const product = await db.product.create({
            data: {
                name: name.trim(),
                description: description ? description.trim() : description,
                price: price,
                stock_quantity: stock_quantity,
                store_id: store.id
            }
        })
        return res.status(201).json({ message: 'Created' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function updateProduct(req, res) {
    const productId = Number(req.params.id)
    const userInfo = req.body.userInfo

    const store = await db.store.findFirst({
        where: {
            owner_id: userInfo.id
        }
    })

    try {
        const product = await db.product.findFirst({
            where: {
                id: productId,
                store_id: store.id
            }
        })

        if (!product)
            return res.status(404).json({ message: 'The server can not find the requested resource' })

        let { name, description, price, stock_quantity } = req.body
        
        if (!name || !price || !stock_quantity)
            return res.status(400).json({ message: 'Missing required fields' })
        if (price < 0)
            return res.status(400).json({ message: `Invalid value for price ${price}` })
        
        price = Number(price)

        await db.product.update({
            where: {
                id: productId
            },
            data: {
                name: name.trim(),
                description: description ? description.trim() : description,
                price: price,
                stock_quantity: stock_quantity,
                store_id: store.id
            }
        })
        res.status(200).json({ message: 'Updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function deleteProduct(req, res) {
    const productId = Number(req.params.id)
    const userInfo = req.body.userInfo
    
    const store = await db.store.findFirst({
        where: {
            owner_id: userInfo.id
        }
    })

    try {
        const product = await db.product.findFirst({
            where: {
                id: productId,
                store_id: store.id
            }
        })

        if (!product)
            return res.status(400).json({ message: 'The server can not find the requested resource' })
        await db.product.delete({
            where: {
                id: productId
            }
        })
        res.status(200).json({ message: 'Deleted' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}