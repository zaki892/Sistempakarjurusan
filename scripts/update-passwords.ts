import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "sistem_pakar_jurusan"

async function updatePasswords() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  })

  try {
    console.log("Updating passwords...")

    // Generate the correct hash for "password123"
    const correctHash = await bcrypt.hash("password123", 10)
    console.log("Correct hash:", correctHash)

    // Update all users with the correct hash
    await connection.execute(
      "UPDATE users SET password = ? WHERE email LIKE ?",
      [correctHash, "%@sman1cibungbulang.sch.id"]
    )

    console.log("Passwords updated successfully!")
  } catch (error) {
    console.error("Error updating passwords:", error)
  } finally {
    await connection.end()
  }
}

updatePasswords()
