import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

const newPassword = "password123"
const hashedPassword = await bcrypt.hash(newPassword, 10)

console.log("Resetting all user passwords...\n")
console.log(`New password: ${newPassword}`)
console.log(`Hashed: ${hashedPassword}\n`)

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistem_pakar_jurusan",
})

try {
  const connection = await pool.getConnection()

  const [result] = await connection.execute("UPDATE users SET password = ? WHERE 1=1", [hashedPassword])

  console.log(`✓ Updated ${result.affectedRows} users`)
  console.log("\nNow try login with password: password123")

  connection.release()
  process.exit(0)
} catch (err) {
  console.log("✗ Error:", err.message)
  process.exit(1)
}
