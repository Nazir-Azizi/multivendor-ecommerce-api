import db from '../lib/db.js'

export async function getCart(req, res) {
    const userId = req.userId

    try {
        let cart = await db.cart.findFirst({
            where: {
                owner_id: userId
            }
        })
        if (!cart) {
            cart = await createCart(userId)
            if (!cart)
                throw new Error('Could not create cart');
        }
        const cartItems = await db.cart_Item.findMany({
            where: {
                cart_id: cart.id
            }
        })
        return res.status(200).json(cartItems)
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

async function createCart(userId) {
    try {
        const cart = await db.cart.create({
            data: {
                owner_id: userId
            }
        })
        return cart
    } catch (error) {
        console.log(error)
        return null        
    }
}

export async function addToCart(req, res) {
    const userId = req.userId
    let { productId } = req.body
    productId = Number(productId)

    let cart = await db.cart.findFirst({
        where: {
            owner_id: userId
        }
    })
    if (!cart) {
        cart = await createCart(userId)
        if (!cart)
            throw new Error('Could not create cart');
    }
    
    try {
        const cartItem = await db.cart_Item.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId
            }
        })
        if (cartItem)
            return res.status(400).json({ message: 'Item already exist' })
        await db.cart_Item.create({
            data: {
                cart_id: cart.id,
                product_id: productId
            }
        })
        
        return res.status(201).json({ message: 'Created' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function removeFromCart(req, res) {
    const productId = Number(req.params.id)
    const userId = req.userId
    try {
        const cart = await db.cart.findFirst({
            where: {
                owner_id: userId
            }
        })
        if (!cart)
            return res.status(404).json({ message: 'The server can not find the requested resource' })
        const cartItem = await db.cart_Item.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId
            }
        })
        if (!cartItem)
            return res.status(404).json({ message: 'The server can not find the requested resource' })
        await db.cart_Item.delete({
            where: {
                product_id_cart_id: {
                    product_id: productId,
                    cart_id: cart.id
                }
            }
        })
        res.status(200).json({ message: 'Deleted' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function clearCart(req, res) {
    const userId = req.userId
    try {
        const cart = await db.cart.findFirst({
            where: {
                owner_id: userId
            }
        })
        if (!cart)
            return res.status(404).json({ message: 'The server can not find the requested resource' })
        await db.cart_Item.deleteMany({
            where: {
                cart_id: cart.id
            }
        })
        res.status(200).json({ message: 'Deleted' })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}