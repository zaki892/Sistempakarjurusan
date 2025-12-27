const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")

async function debugLogin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sistem_pakar_jurusan",
  })

  try {
    console.log("[DEBUG] Checking database connection...")
    const [users] = await connection.execute("SELECT id, email, password FROM users LIMIT 5")

    console.log("[DEBUG] Users in database:")
    users.forEach((user) => {
      console.log(`  ID: ${user.id}, Email: ${user.email}, Password Hash: ${user.password}`)
    })

    // Test password matching
    const testPassword = "password123"
    const testHash = "$2a$10$slYQmyNdGzIqKM0dK5/t.OSst5ZDYvUTRVc1MZn0CKBz5NxxIyxri"

    console.log("\n[DEBUG] Testing password hash...")
    console.log(`Test password: ${testPassword}`)
    console.log(`Test hash: ${testHash}`)

    const match = await bcrypt.compare(testPassword, testHash)
    console.log(`Hash match result: ${match}`)

    if (users.length > 0) {
      const user = users[0]
      const userPasswordMatch = await bcrypt.compare(testPassword, user.password)
      console.log(`\n[DEBUG] First user password match: ${userPasswordMatch}`)
    }
  } catch (error) {
    console.error("[ERROR]", error.message)
  } finally {
    await connection.end()
  }
}

debugLogin()
