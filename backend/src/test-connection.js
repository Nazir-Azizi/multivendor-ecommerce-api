import db from "./lib/db.js"

try {
    await db.$connect()

    console.log('Database connected successfuly!')
} catch (error) {
    console.log("Database connection failed:", error)
} finally {
    await db.$disconnect
}