import db from '../lib/db.js'

export async function getCart(req, res) {
    const userId = req.body.userId.id
    console.log(userId)
    res.json({ message: 'OK' })
}


export async function addToCart(req, res) {
    res.json({ message: 'OK' })
    
}

export async function removeFromCart(req, res) {
    res.json({ message: 'OK' })
    
}
export async function clearCart(req, res) {
    res.json({ message: 'OK' })
    
}