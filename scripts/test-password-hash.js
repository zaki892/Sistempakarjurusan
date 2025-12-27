// Test Password Hashing
const bcrypt = require("bcryptjs")

async function testPassword() {
  try {
    console.log("[v0] Testing Password Hash...\n")

    const testPassword = "password123"

    // Generate new hash
    const hash = "$2a$10$slYQmyNdGzIqKM0dK5/t.OSst5ZDYvUTRVc1MZn0CKBz5NxxIyxri"

    // Test compare
    const isMatch = await bcrypt.compare(testPassword, hash)

    console.log("Password:", testPassword)
    console.log("Hash:", hash)
    console.log("Match Result:", isMatch ? "✅ COCOK" : "❌ TIDAK COCOK")

    if (!isMatch) {
      // Generate correct hash
      const newHash = await bcrypt.hash(testPassword, 10)
      console.log("\n⚠️ Hash tidak match! Generate hash baru:")
      console.log("New Hash:", newHash)
      console.log("\nGunakan hash ini di database:")
      console.log(`UPDATE users SET password = '${newHash}' WHERE 1=1;`)
    }
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

testPassword()
