import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get guru's kelas from database
    const guruData = (await query(`SELECT kelas FROM users WHERE id = ?`, [user.id])) as any[]
    if (guruData.length === 0 || !guruData[0].kelas) {
      return NextResponse.json({ message: "Guru belum ditugaskan ke kelas" }, { status: 403 })
    }
    const guruKelas = guruData[0].kelas

    const siswaCount = (await query("SELECT COUNT(*) as count FROM users WHERE role = ? AND kelas = ?", ["siswa", guruKelas])) as any[]
    const soalCount = (await query("SELECT COUNT(*) as count FROM soal")) as any[]
    const jurusanCount = (await query("SELECT COUNT(*) as count FROM jurusan")) as any[]
    const hasilCount = (await query("SELECT COUNT(*) as count FROM hasil_tes ht JOIN users s ON ht.siswa_id = s.id WHERE s.kelas = ? AND ht.status = ?", [guruKelas, "selesai"])) as any[]

    return NextResponse.json({
      stats: {
        totalSiswa: siswaCount[0]?.count || 0,
        totalSoal: soalCount[0]?.count || 0,
        totalJurusan: jurusanCount[0]?.count || 0,
        totalHasil: hasilCount[0]?.count || 0,
        kelas: guruKelas,
      },
      userName: user.nama,
      kelas: guruKelas,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
