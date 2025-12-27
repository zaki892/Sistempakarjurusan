  import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get guru's kelas
    const guruData = (await query(`SELECT kelas FROM users WHERE id = ?`, [user.id])) as any[]
    if (guruData.length === 0 || !guruData[0].kelas) {
      return NextResponse.json({ message: "Guru belum ditugaskan ke kelas" }, { status: 403 })
    }
    const guruKelas = guruData[0].kelas

    const siswaResults = (await query(
      `SELECT id, nama, email, original_password as password, no_induk, kelas FROM users
       WHERE role = 'siswa' AND kelas = ?
       ORDER BY nama`,
      [guruKelas],
    )) as any[]

    return NextResponse.json({
      siswa: siswaResults,
      userName: user.nama,
      guruKelas: guruKelas,
    })
  } catch (error) {
    console.error("Siswa error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { nama, email, no_induk, password } = await request.json()

    if (!nama || !email || !no_induk || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get guru's kelas
    const guruData = (await query(`SELECT kelas FROM users WHERE id = ?`, [user.id])) as any[]
    if (guruData.length === 0 || !guruData[0].kelas) {
      return NextResponse.json({ message: "Guru belum ditugaskan ke kelas" }, { status: 403 })
    }
    const kelas = guruData[0].kelas

    // Check if email exists
    const existing = await query(`SELECT id FROM users WHERE email = ?`, [email])
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 })
    }

    // Hash password for login
    const hashedPassword = await bcrypt.hash(password, 10)

    await query(
      `INSERT INTO users (nama, email, password, original_password, role, no_induk, kelas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, email, hashedPassword, password, "siswa", no_induk, kelas],
    )

    return NextResponse.json({ message: "Siswa created successfully", success: true })
  } catch (error) {
    console.error("Create siswa error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, nama, email, no_induk, password } = await request.json()

    if (!id || !nama || !email || !no_induk) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get guru's kelas
    const guruData = (await query(`SELECT kelas FROM users WHERE id = ?`, [user.id])) as any[]
    if (guruData.length === 0 || !guruData[0].kelas) {
      return NextResponse.json({ message: "Guru belum ditugaskan ke kelas" }, { status: 403 })
    }
    const kelas = guruData[0].kelas

    // Check if email is already used by another user
    const existing = await query(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, id])
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 })
    }

    let updateQuery = `UPDATE users SET nama = ?, email = ?, no_induk = ?, kelas = ? WHERE id = ? AND role = 'siswa'`
    let params = [nama, email, no_induk, kelas, id]

    if (password) {
      // Hash password for login
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery = `UPDATE users SET nama = ?, email = ?, password = ?, original_password = ?, no_induk = ?, kelas = ? WHERE id = ? AND role = 'siswa'`
      params = [nama, email, hashedPassword, password, no_induk, kelas, id]
    }

    await query(updateQuery, params)

    return NextResponse.json({ message: "Siswa updated successfully", success: true })
  } catch (error) {
    console.error("Update siswa error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "Missing siswa ID" }, { status: 400 })
    }

    // Delete related data first (in correct order due to foreign key constraints)
    // Delete jawaban_tes and skor_saw that reference hasil_tes
    await query(`DELETE FROM jawaban_tes WHERE hasil_tes_id IN (SELECT id FROM hasil_tes WHERE siswa_id = ?)`, [id])
    await query(`DELETE FROM skor_saw WHERE hasil_tes_id IN (SELECT id FROM hasil_tes WHERE siswa_id = ?)`, [id])

    // Delete hasil_tes
    await query(`DELETE FROM hasil_tes WHERE siswa_id = ?`, [id])

    // Delete other related data
    await query(`DELETE FROM notifikasi WHERE siswa_id = ?`, [id])
    await query(`DELETE FROM chat_history WHERE siswa_id = ?`, [id])

    // Finally delete the student
    await query(`DELETE FROM users WHERE id = ? AND role = 'siswa'`, [id])

    return NextResponse.json({ message: "Siswa deleted successfully", success: true })
  } catch (error) {
    console.error("Delete siswa error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
