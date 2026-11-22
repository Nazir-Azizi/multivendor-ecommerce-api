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
            return res.status(500).json({ message: 'The server encountered an unexpected condition that prevented it from fulfilling the request' })
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
        return res.status(500).json({ message: 'The server encountered an unexpected condition that prevented it from fulfilling the request' })
    }
}

export async function createProduct(req, res) {
    let { name, description, price, stock_quantity, store_id } = req.body
    price = Number(price)
    store_id = Number(store_id)

    if (!name || !price || !stock_quantity || !store_id)
        return res.status(400).json({ message: 'Complete all the data for product' })
    if (price < 0)
        return res.status(400).json({ message: 'Price can not be negative' })

    try {
        const product = await db.product.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                price: price,
                stock_quantity: stock_quantity,
                store_id: store_id
            }
        })
        return res.status(201).json({ message: 'Product created' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function updateProduct(req, res) {
    const productId = Number(req.params.id)
    try {
        const product = await db.product.findFirst({
            where: {
                id: productId
            }
        })

        if (!product)
            return res.status(400).json({ message: 'No such product' })

        let { name, description, price, stock_quantity, store_id } = req.body
        price = Number(price)
        store_id = Number(store_id)

        await db.product.update({
            where: {
                id: productId
            },
            data: {
                name: name.trim(),
                description: description.trim(),
                price: price,
                stock_quantity: stock_quantity,
                store_id: store_id
            }
        })
        res.status(200).json({ message: 'Product updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function deleteProduct(req, res) {
    const productId = Number(req.params.id)
    try {
        const product = await db.product.findFirst({
            where: {
                id: productId
            }
        })

        if (!product)
            return res.status(400).json({ message: 'No such product' })
        await db.product.delete({
            where: {
                id: productId
            }
        })
        res.status(200).json({ message: 'Product removed' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}