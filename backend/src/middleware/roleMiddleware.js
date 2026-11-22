import db from '../lib/db.js'

export async function isSeller(req, res, next) {
    const userId = Number(req.body.userInfo.userId)
    const user = getUser(userId)
    if (!user)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    if (user.role != 0)
        return res.status(401).json({ message: 'Unauthorized' })
    req.body.userInfo = user
    next()
    
}

export async function isUser(req, res, next) {
    const userId = Number(req.body.userInfo.userId)
    const user = getUser(userId)
    if (!user)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    if (user.role != 1)
        return res.status(401).json({ message: 'Unauthorized' })
    req.body.userInfo = user
    next()
}

async function getUser(userId) {
    try {
        const user = await db.user.findFirst({
            where: {
                id: userId
            }
        })
        return user
    } catch (error) {
        console.log(error)       
    }
    return null
}