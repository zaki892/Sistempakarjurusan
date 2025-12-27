import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "kepala_sekolah") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const siswaCount = (await query("SELECT COUNT(*) as count FROM users WHERE role = ?", ["siswa"])) as any[]
    const siswaSelesaiCount = (await query("SELECT COUNT(DISTINCT siswa_id) as count FROM hasil_tes WHERE status = ?", [
      "selesai",
    ])) as any[]
    const jurusanCount = (await query("SELECT COUNT(*) as count FROM jurusan")) as any[]
    const guruCount = (await query("SELECT COUNT(*) as count FROM users WHERE role = ?", ["guru"])) as any[]
    const avgScore = (await query("SELECT AVG(skor_akhir) as avg FROM hasil_tes WHERE status = ?", [
      "selesai",
    ])) as any[]

    return NextResponse.json({
      stats: {
        totalSiswa: siswaCount[0]?.count || 0,
        siswaSelesaiTes: siswaSelesaiCount[0]?.count || 0,
        totalJurusan: jurusanCount[0]?.count || 0,
        totalGuru: guruCount[0]?.count || 0,
        averageScore: avgScore[0]?.avg ? Number.parseFloat(avgScore[0].avg) : 0,
      },
      userName: user.nama,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
