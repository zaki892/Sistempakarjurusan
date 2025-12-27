// Test Database Connection
const mysql = require("mysql2/promise")

async function testConnection() {
  try {
    console.log("[v0] Testing MySQL Connection...")

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "sistem_pakar_jurusan",
    })

    console.log("✅ Database Connected Successfully!")

    // Check users table
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
    console.log("✅ Users in database:", users[0].count)

    // List all users
    const [allUsers] = await connection.execute("SELECT id, email, nama, role FROM users")
    console.log("\n📋 All Users:")
    console.table(allUsers)

    await connection.end()
  } catch (error) {
    console.error("❌ Connection Error:", error.message)
    console.error("Pastikan:")
    console.error("1. MySQL sudah running (XAMPP)")
    console.error('2. Database "sistem_pakar_jurusan" sudah dibuat')
    console.error('3. Tabel "users" sudah ada')
  }
}

testConnection()
