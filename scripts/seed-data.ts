import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "sistem_pakar_jurusan"

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  })

  try {
    console.log("Starting database seeding...")

    // Hash passwords
    const hashedPassword = await bcrypt.hash("password", 10)

    // Insert default users
    await connection.execute(
      `INSERT IGNORE INTO users (email, password, nama, role, no_induk, kelas)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["siswa@example.com", hashedPassword, "Siswa Demo", "siswa", "12345", "12-A"],
    )

    await connection.execute(
      `INSERT IGNORE INTO users (email, password, nama, role)
       VALUES (?, ?, ?, ?)`,
      ["guru@example.com", hashedPassword, "Guru Demo", "guru"],
    )

    await connection.execute(
      `INSERT IGNORE INTO users (email, password, nama, role)
       VALUES (?, ?, ?, ?)`,
      ["kepsek@example.com", hashedPassword, "Kepala Sekolah", "kepala_sekolah"],
    )

    // Insert aspek (criteria)
    const aspekData = [
      { nama: "Logika & Analisis", deskripsi: "Kemampuan berpikir logis dan analitis" },
      { nama: "Kreativitas", deskripsi: "Kemampuan berpikir kreatif dan inovatif" },
      { nama: "Komunikasi", deskripsi: "Kemampuan berkomunikasi dengan baik" },
      { nama: "Kepemimpinan", deskripsi: "Kemampuan memimpin dan mengorganisir" },
      { nama: "Kerja Tim", deskripsi: "Kemampuan bekerja dalam tim" },
    ]

    for (const aspek of aspekData) {
      await connection.execute(
        `INSERT IGNORE INTO aspek (nama, deskripsi, bobot)
         VALUES (?, ?, ?)`,
        [aspek.nama, aspek.deskripsi, 20],
      )
    }

    // Insert jurusan (majors)
    const jurusanData = [
      {
        nama: "Teknik Informatika",
        kode: "TI",
        deskripsi:
          "Program studi untuk mengembangkan keahlian di bidang teknologi informasi dan pengembangan perangkat lunak",
      },
      {
        nama: "Teknik Industri",
        kode: "TIN",
        deskripsi: "Program studi untuk mengoptimalkan proses dan sistem dalam industri",
      },
      {
        nama: "Manajemen",
        kode: "MJ",
        deskripsi: "Program studi untuk mengembangkan kemampuan manajemen bisnis dan organisasi",
      },
      {
        nama: "Desain Grafis",
        kode: "DG",
        deskripsi: "Program studi untuk mengembangkan kreativitas dalam desain visual",
      },
      {
        nama: "Akuntansi",
        kode: "AK",
        deskripsi: "Program studi untuk mengembangkan keahlian di bidang akuntansi dan keuangan",
      },
    ]

    for (const jurusan of jurusanData) {
      await connection.execute(
        `INSERT IGNORE INTO jurusan (nama, kode_jurusan, deskripsi)
         VALUES (?, ?, ?)`,
        [jurusan.nama, jurusan.kode, jurusan.deskripsi],
      )
    }

    // Insert sample questions
    const questions = [
      { aspekId: 1, text: "Saya senang memecahkan masalah yang kompleks" },
      { aspekId: 1, text: "Saya mudah memahami konsep matematika" },
      { aspekId: 2, text: "Saya memiliki ide-ide baru yang sering" },
      { aspekId: 2, text: "Saya senang menciptakan sesuatu yang belum ada sebelumnya" },
      { aspekId: 3, text: "Saya lancar berkomunikasi dalam presentasi" },
      { aspekId: 3, text: "Saya mudah mengekspresikan pendapat saya" },
      { aspekId: 4, text: "Saya senang memimpin sebuah kelompok" },
      { aspekId: 4, text: "Saya dapat membuat keputusan dengan bijak" },
      { aspekId: 5, text: "Saya nyaman bekerja dalam tim" },
      { aspekId: 5, text: "Saya dapat berkolaborasi dengan baik" },
    ]

    for (const q of questions) {
      const result = (await connection.execute(
        `INSERT INTO soal (aspek_id, pertanyaan, urutan)
         VALUES (?, ?, ?)`,
        [q.aspekId, q.text, 1],
      )) as any

      const soalId = result[0].insertId

      // Insert options
      const options = [
        { urutan: 1, teks: "Sangat Tidak Setuju", nilai: 1 },
        { urutan: 2, teks: "Tidak Setuju", nilai: 2 },
        { urutan: 3, teks: "Netral", nilai: 3 },
        { urutan: 4, teks: "Setuju", nilai: 4 },
        { urutan: 5, teks: "Sangat Setuju", nilai: 5 },
      ]

      for (const opt of options) {
        await connection.execute(
          `INSERT INTO pilihan_soal (soal_id, urutan, teks, nilai)
           VALUES (?, ?, ?, ?)`,
          [soalId, opt.urutan, opt.teks, opt.nilai],
        )
      }
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Seeding error:", error)
  } finally {
    await connection.end()
  }
}

seedDatabase()
