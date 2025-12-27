import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const history = (await query(
      `SELECT ht.id, ht.tanggal_tes, ht.skor_akhir, ht.status, j.nama as jurusan_nama
       FROM hasil_tes ht
       LEFT JOIN jurusan j ON ht.jurusan_rekomendasi_id = j.id
       WHERE ht.siswa_id = ?
       ORDER BY ht.tanggal_tes DESC`,
      [user.id],
    )) as any[]

    return NextResponse.json({
      history: history.map((h: any) => ({
        id: h.id,
        tanggal_tes: h.tanggal_tes,
        skor_akhir: Number.parseFloat(h.skor_akhir),
        jurusan_rekomendasi: h.jurusan_nama,
        status: h.status,
      })),
      userName: user.nama,
    })
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
