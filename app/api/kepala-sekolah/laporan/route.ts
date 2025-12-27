import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "kepala_sekolah") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get guru reports
    const guruReports = await query(`
      SELECT
        u.id,
        u.nama as nama_guru,
        u.email,
        COUNT(DISTINCT s.id) as total_siswa,
        COUNT(DISTINCT CASE WHEN ht.status = 'selesai' THEN ht.id END) as siswa_selesai_tes,
        COALESCE(AVG(ht.skor_akhir), 0) as rata_rata_skor,
        MAX(ht.tanggal_tes) as laporan_terakhir
      FROM users u
      LEFT JOIN users s ON s.kelas = u.kelas AND s.role = 'siswa'
      LEFT JOIN hasil_tes ht ON ht.siswa_id = s.id
      WHERE u.role = 'guru'
      GROUP BY u.id, u.nama, u.email
      ORDER BY u.nama
    `) as any[]

    // Get class reports
    const classReports = await query(`
      SELECT
        s.kelas,
        COUNT(DISTINCT s.id) as total_siswa,
        COUNT(DISTINCT CASE WHEN ht.status = 'selesai' THEN ht.id END) as siswa_selesai_tes,
        COALESCE(AVG(ht.skor_akhir), 0) as rata_rata_skor,
        (
          SELECT j.nama
          FROM jurusan j
          INNER JOIN hasil_tes ht2 ON ht2.jurusan_rekomendasi_id = j.id
          WHERE ht2.siswa_id IN (
            SELECT s2.id FROM users s2 WHERE s2.kelas = s.kelas AND s2.role = 'siswa'
          )
          GROUP BY j.id, j.nama
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) as jurusan_populer
      FROM users s
      LEFT JOIN hasil_tes ht ON ht.siswa_id = s.id
      WHERE s.role = 'siswa'
      GROUP BY s.kelas
      ORDER BY s.kelas
    `) as any[]

    // Get detailed student reports per class
    const studentReports = await query(`
      SELECT
        s.kelas,
        s.nama as nama_siswa,
        s.no_induk,
        ht.skor_akhir,
        ht.status,
        ht.tanggal_tes,
        j.nama as jurusan_rekomendasi
      FROM users s
      LEFT JOIN hasil_tes ht ON ht.siswa_id = s.id
      LEFT JOIN jurusan j ON ht.jurusan_rekomendasi_id = j.id
      WHERE s.role = 'siswa'
      ORDER BY s.kelas, s.nama
    `) as any[]

    return NextResponse.json({
      guruReports: guruReports.map((r: any) => ({
        id: Number(r.id),
        nama_guru: r.nama_guru,
        email: r.email,
        total_siswa: Number(r.total_siswa),
        siswa_selesai_tes: Number(r.siswa_selesai_tes),
        rata_rata_skor: Number(r.rata_rata_skor),
        laporan_terakhir: r.laporan_terakhir || null,
      })),
      classReports: classReports.map((r: any) => ({
        kelas: r.kelas,
        total_siswa: Number(r.total_siswa),
        siswa_selesai_tes: Number(r.siswa_selesai_tes),
        rata_rata_skor: Number(r.rata_rata_skor),
        jurusan_populer: r.jurusan_populer || 'Belum ada data',
      })),
      studentReports: studentReports.map((r: any) => ({
        kelas: r.kelas,
        nama_siswa: r.nama_siswa,
        no_induk: r.no_induk,
        skor_akhir: r.skor_akhir ? Number(r.skor_akhir) : null,
        status: r.status || 'belum tes',
        tanggal_tes: r.tanggal_tes,
        jurusan_rekomendasi: r.jurusan_rekomendasi || 'Belum ada',
      })),
      userName: user.nama,
    })

  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
