import jwt from 'jsonwebtoken'

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) 
        return res.status(400).json({ message: 'Missing required token' })
    try {
        const JWT_SECRET = process.env.JWT_SECRET

        const decode = jwt.verify(token, JWT_SECRET)
        req.body.userInfo = decode
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}