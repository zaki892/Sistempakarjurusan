// Script untuk generate hash password yang benar untuk "password123"
import bcrypt from "bcryptjs"
import mysql from "mysql2/promise"

async function fixPasswords() {
  try {
    // Generate hash untuk password123
    const hashedPassword = await bcrypt.hash("password123", 10)
    console.log('[v0] Password "password123" hash:', hashedPassword)

    // Test verify
    const isMatch = await bcrypt.compare("password123", hashedPassword)
    console.log("[v0] Verify test:", isMatch ? "✓ PASS" : "✗ FAIL")

    if (!isMatch) {
      console.log("[v0] ERROR: Hash tidak cocok!")
      process.exit(1)
    }

    // Connect ke database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sistem_pakar_jurusan",
    })

    console.log("[v0] Terhubung ke database")

    // Update password semua user
    const sql = `UPDATE users SET password = ? WHERE 1=1`
    const [result] = await connection.execute(sql, [hashedPassword])

    console.log(`[v0] ✓ ${result.affectedRows} user password telah diperbarui`)
    console.log("[v0] Password semua user: password123")

    // Verify satu user
    const [users] = await connection.execute("SELECT id, email, password FROM users LIMIT 1")
    if (users.length > 0) {
      const user = users[0]
      console.log(`[v0] Verify user ${user.email}...`)
      const verify = await bcrypt.compare("password123", user.password)
      console.log(`[v0] Verify result: ${verify ? "✓ PASS" : "✗ FAIL"}`)
    }

    await connection.end()
    console.log("[v0] ✓ Password fix complete!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] ERROR:", error.message)
    process.exit(1)
  }
}

fixPasswords()
