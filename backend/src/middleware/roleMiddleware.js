export async function isSeller(req, res, next) {
    const { role } = req.body.userInfo
    if (role != 0)
        return res.status(403).json({ message: 'Not allowed' })
    next()
}

export async function isBuyer(req, res, next) {
    const { role } = req.body.userInfo
    if (role != 1)
        return res.status(403).json({ message: 'Not allowed' })
    next()
}