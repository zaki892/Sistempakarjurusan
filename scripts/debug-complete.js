import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

const testEmail = "siswa001@test.com"
const testPassword = "password123"
const expectedHash = "$2a$10$slYQmyNdGzIqKM0dK5/t.OSst5ZDYvUTRVc1MZn0CKBz5NxxIyxri"

console.log("=".repeat(60))
console.log("SISTEM PAKAR - DEBUG LOGIN")
console.log("=".repeat(60))

// Step 1: Test bcrypt
console.log("\n1. Testing bcrypt password comparison...")
try {
  const matches = await bcrypt.compare(testPassword, expectedHash)
  console.log(`   Password "${testPassword}" matches hash: ${matches ? "✓ YES" : "✗ NO"}`)
  if (!matches) {
    console.log("   ERROR: Password hash mismatch! Hash might be corrupted.")
  }
} catch (err) {
  console.log("   ERROR in bcrypt:", err.message)
}

// Step 2: Test database connection
console.log("\n2. Testing database connection...")
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistem_pakar_jurusan",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

try {
  const connection = await pool.getConnection()
  console.log("   ✓ Connected to database")
  console.log(`   Host: ${process.env.DB_HOST || "localhost"}`)
  console.log(`   User: ${process.env.DB_USER || "root"}`)
  console.log(`   Database: ${process.env.DB_NAME || "sistem_pakar_jurusan"}`)

  // Step 3: Check if users table exists
  console.log("\n3. Checking users table...")
  const [tables] = await connection.execute(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
    [process.env.DB_NAME || "sistem_pakar_jurusan"],
  )
  if (tables[0].count > 0) {
    console.log("   ✓ Users table exists")
  } else {
    console.log("   ✗ Users table NOT found")
  }

  // Step 4: Check users count
  console.log("\n4. Checking users in database...")
  const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
  console.log(`   Total users: ${users[0].count}`)

  // Step 5: Find specific user
  console.log(`\n5. Looking for user: ${testEmail}...`)
  const [foundUsers] = await connection.execute("SELECT id, email, password, nama, role FROM users WHERE email = ?", [
    testEmail,
  ])

  if (foundUsers.length > 0) {
    const user = foundUsers[0]
    console.log("   ✓ User found!")
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.nama}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Password Hash: ${user.password.substring(0, 20)}...`)

    // Step 6: Test password
    console.log(`\n6. Testing password verification...`)
    const matches = await bcrypt.compare(testPassword, user.password)
    console.log(`   Password match: ${matches ? "✓ YES" : "✗ NO"}`)

    if (!matches) {
      console.log("   ERROR: Stored password hash doesn't match!")
      console.log("   Try updating password with: npm run reset-password")
    }
  } else {
    console.log(`   ✗ User NOT found with email: ${testEmail}`)
    console.log("   Available users:")
    const [allUsers] = await connection.execute("SELECT id, email, nama, role FROM users LIMIT 10")
    allUsers.forEach((u) => {
      console.log(`     - ${u.email} (${u.role})`)
    })
  }

  connection.release()
} catch (err) {
  console.log("   ✗ Database connection error:", err.message)
  console.log("   Make sure MySQL is running and credentials are correct!")
}

console.log("\n" + "=".repeat(60))
console.log("DEBUG COMPLETE")
console.log("=".repeat(60))

process.exit(0)
