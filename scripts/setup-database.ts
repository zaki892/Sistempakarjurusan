import mysql from "mysql2/promise"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "sistem_pakar_jurusan"

async function setupDatabase() {
  try {
    // Connect tanpa database dulu
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    })

    console.log("Connected to MySQL...")

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`)
    console.log(`Database ${DB_NAME} created or already exists`)

    await connection.end()

    // Connect ke database yang baru
    const dbConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    })

    console.log(`Connected to ${DB_NAME}...`)

    // Create tables
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(255) NOT NULL,
        role ENUM('siswa', 'guru', 'kepala_sekolah') NOT NULL,
        no_induk VARCHAR(50),
        kelas VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX(role),
        INDEX(email)
      )`,

      // Jurusan/Majors table
      `CREATE TABLE IF NOT EXISTS jurusan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        kode_jurusan VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Aspek/Criteria table
      `CREATE TABLE IF NOT EXISTS aspek (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        bobot DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Soal test questions table
      `CREATE TABLE IF NOT EXISTS soal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aspek_id INT NOT NULL,
        pertanyaan TEXT NOT NULL,
        urutan INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(aspek_id) REFERENCES aspek(id),
        INDEX(aspek_id)
      )`,

      // Options untuk soal
      `CREATE TABLE IF NOT EXISTS pilihan_soal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        soal_id INT NOT NULL,
        urutan INT,
        teks VARCHAR(255) NOT NULL,
        nilai INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(soal_id) REFERENCES soal(id) ON DELETE CASCADE,
        INDEX(soal_id)
      )`,

      // Relationship antara jurusan dan aspek
      `CREATE TABLE IF NOT EXISTS jurusan_aspek (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jurusan_id INT NOT NULL,
        aspek_id INT NOT NULL,
        bobot DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(jurusan_id) REFERENCES jurusan(id) ON DELETE CASCADE,
        FOREIGN KEY(aspek_id) REFERENCES aspek(id) ON DELETE CASCADE,
        UNIQUE KEY unique_jurusan_aspek (jurusan_id, aspek_id)
      )`,

      // Test results
      `CREATE TABLE IF NOT EXISTS hasil_tes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        tanggal_tes TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        skor_akhir DECIMAL(8,2),
        jurusan_rekomendasi_id INT,
        status ENUM('selesai', 'belum_selesai') DEFAULT 'belum_selesai',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(siswa_id) REFERENCES users(id),
        FOREIGN KEY(jurusan_rekomendasi_id) REFERENCES jurusan(id),
        INDEX(siswa_id),
        INDEX(status)
      )`,

      // Test answers
      `CREATE TABLE IF NOT EXISTS jawaban_tes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hasil_tes_id INT NOT NULL,
        soal_id INT NOT NULL,
        pilihan_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(hasil_tes_id) REFERENCES hasil_tes(id) ON DELETE CASCADE,
        FOREIGN KEY(soal_id) REFERENCES soal(id),
        FOREIGN KEY(pilihan_id) REFERENCES pilihan_soal(id),
        INDEX(hasil_tes_id)
      )`,

      // SAW Score details
      `CREATE TABLE IF NOT EXISTS skor_saw (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hasil_tes_id INT NOT NULL,
        jurusan_id INT NOT NULL,
        skor DECIMAL(8,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(hasil_tes_id) REFERENCES hasil_tes(id) ON DELETE CASCADE,
        FOREIGN KEY(jurusan_id) REFERENCES jurusan(id),
        INDEX(hasil_tes_id)
      )`,

      // Notifications
      `CREATE TABLE IF NOT EXISTS notifikasi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        pesan TEXT,
        tipe ENUM('info', 'warning', 'success') DEFAULT 'info',
        dibaca BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(siswa_id) REFERENCES users(id),
        INDEX(siswa_id),
        INDEX(dibaca)
      )`,

      // Chat history
      `CREATE TABLE IF NOT EXISTS chat_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        pertanyaan TEXT NOT NULL,
        jawaban TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(siswa_id) REFERENCES users(id),
        INDEX(siswa_id)
      )`,
    ]

    for (const table of tables) {
      await dbConnection.execute(table)
      console.log("Table created/verified")
    }

    console.log("All tables created successfully!")
    await dbConnection.end()
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
