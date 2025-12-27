import mysql from "mysql2/promise"
import fs from "fs"
import path from "path"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "sistem_pakar_jurusan"

async function seedCompleteDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
  })

  try {
    console.log("Starting complete database seeding...")

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "database", "complete-seed.sql")
    let sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Remove the USE statement since we're already connected to the database
    sqlContent = sqlContent.replace(/USE `sistem_pakar_jurusan`;\s*/, "")

    // Split the SQL into individual statements and execute them
    const statements = sqlContent.split(";").filter(stmt => stmt.trim().length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement.trim() + ";")
      }
    }

    console.log("Complete database seeding completed successfully!")
  } catch (error) {
    console.error("Seeding error:", error)
  } finally {
    await connection.end()
  }
}

seedCompleteDatabase()
