export default async function authenticateRole(req, res, next) {
    const { role } = req.body.userInfo
    if (role != 0)
        return res.status(403).json({ message: 'Not allowed' })
    next()
}