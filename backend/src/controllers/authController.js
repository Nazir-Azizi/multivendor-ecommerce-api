import db from '../lib/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function loginControl(req, res) {

    const { email, password } = req.body

    if (!email || !password) {
         return res.status(400).json({ message: 'Complete all the data fields' })
    }
    
    try {
        const JWT_SECRET = process.env.JWT_SECRET

        const user = await db.user.findFirst({
            where: {
                email: email.trim()
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })
        
        return res.status(201).json({ message: 'Login success', token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}

export async function registerControl(req, res) {

    const { name, email, password, role } = req.body

    if (!name || !email || !password || role == undefined) {
        return res.status(400).json({ message: 'Complete all the data fields' })
    }
    if (role != 1 && role != 0) {
        return res.status(400).json({ message: 'No such role exists' })
    }
    const user = await db.user.findFirst({
        where: {
            email: email.trim()
        }
    })
    if (user) {
        return res.status(400).json({ message: 'Email already in use' })
    }
    try {
        const HASH_SALT = Number(process.env.HASH_SALT)
        const JWT_SECRET = process.env.JWT_SECRET

        const hashedPassword = await bcrypt.hash(password.trim(), HASH_SALT)

        const user = await db.user.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword,
                role
            }
        })

        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })
        
        return res.status(201).json({ message: 'Profile created', token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server failed' })
    }
}