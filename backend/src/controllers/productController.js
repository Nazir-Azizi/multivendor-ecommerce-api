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
            return res.status(404).json({ message: 'No products found' })
        return res.status(200).json(products)
    } else {
        try {
            const products = await db.product.findMany()
            if (!products)
                return res.status(404).json({ message: 'No products found' })
            return res.status(200).json(products)
        } catch (error) {
            return res.status(500).json({ message: 'Server failed' })
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
            return res.status(404).json({ message: 'Product not found' })
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}