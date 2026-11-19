import jwt from 'jsonwebtoken'

export async function authenticateToken(req, res, next) {
    const { token } = req.body

    if (!token) 
        return res.status(403).json({ message: 'No token provided' })
    try {
        const JWT_SECRET = process.env.JWT_SECRET

        const decode = jwt.verify(token, JWT_SECRET)
        req.body.userInfo = decode
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}