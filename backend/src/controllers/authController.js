import db from '../lib/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function loginControl(req, res) {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    
    try {
        const JWT_SECRET = process.env.JWT_SECRET

        const user = await db.user.findFirst({
            where: {
                email: email.trim()
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" })
        
        return res.status(200).json({ message: 'Login successful', token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}

export async function registerControl(req, res) {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    const user = await db.user.findFirst({
        where: {
            email: email.trim()
        }
    })
    if (user) {
        return res.status(409).json({ message: 'Username is already taken' })
    }
    try {
        const HASH_SALT = Number(process.env.HASH_SALT)
        const JWT_SECRET = process.env.JWT_SECRET

        const hashedPassword = await bcrypt.hash(password.trim(), HASH_SALT)

        const user = await db.user.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" })
        
        return res.status(200).json({ message: 'SignIn successful', token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later' })
    }
}