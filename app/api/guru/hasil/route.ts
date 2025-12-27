import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

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

    const hasilTesResults = (await query(
      `SELECT ht.id, ht.tanggal_tes, ht.skor_akhir, ht.status,
              j.nama as jurusan_nama, j.deskripsi as jurusan_deskripsi,
              s.nama as siswa_nama, s.no_induk, s.kelas
       FROM hasil_tes ht
       LEFT JOIN jurusan j ON ht.jurusan_rekomendasi_id = j.id
       LEFT JOIN users s ON ht.siswa_id = s.id
       WHERE s.kelas = ?
       ORDER BY ht.tanggal_tes DESC`,
      [guruKelas],
    )) as any[]

    return NextResponse.json({
      hasil: hasilTesResults.map((h: any) => ({
        id: Number(h.id),
        tanggal_tes: h.tanggal_tes,
        skor_akhir: Number(h.skor_akhir) || 0,
        status: h.status,
        jurusan_rekomendasi: {
          nama: h.jurusan_nama,
          deskripsi: h.jurusan_deskripsi,
        },
        siswa: {
          nama: h.siswa_nama,
          no_induk: h.no_induk,
          kelas: h.kelas,
        },
      })),
      userName: user.nama,
      guruKelas: guruKelas,
    })
  } catch (error) {
    console.error("Hasil error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}


