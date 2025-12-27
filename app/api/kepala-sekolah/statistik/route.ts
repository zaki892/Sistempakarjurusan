import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "kepala_sekolah") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get overall school statistics
    const overallStats = await query(`
      SELECT
        COUNT(DISTINCT CASE WHEN u.role = 'guru' THEN u.id END) as total_guru,
        COUNT(DISTINCT CASE WHEN u.role = 'siswa' THEN u.id END) as total_siswa,
        COUNT(DISTINCT CASE WHEN ht.status = 'selesai' THEN ht.id END) as total_selesai_tes,
        COUNT(DISTINCT CASE WHEN ht.status IS NULL OR ht.status != 'selesai' THEN u.id END) as total_belum_tes,
        COALESCE(AVG(ht.skor_akhir), 0) as rata_rata_skor_keseluruhan,
        COUNT(DISTINCT CASE WHEN u.role = 'guru' THEN u.kelas END) as kelas_aktif
      FROM users u
      LEFT JOIN hasil_tes ht ON ht.siswa_id = u.id AND u.role = 'siswa'
    `) as any[]

    // Get guru reports
    const guruReports = await query(`
      SELECT
        g.id,
        g.nama as nama_guru,
        g.email,
        COUNT(DISTINCT s.id) as total_siswa,
        COUNT(DISTINCT CASE WHEN ht.status = 'selesai' THEN ht.id END) as siswa_selesai_tes,
        COUNT(DISTINCT CASE WHEN ht.status IS NULL OR ht.status != 'selesai' THEN s.id END) as siswa_belum_tes,
        COALESCE(AVG(ht.skor_akhir), 0) as rata_rata_skor,
        MAX(ht.tanggal_tes) as laporan_terakhir
      FROM users g
      LEFT JOIN users s ON s.kelas = g.kelas AND s.role = 'siswa'
      LEFT JOIN hasil_tes ht ON ht.siswa_id = s.id
      WHERE g.role = 'guru'
      GROUP BY g.id, g.nama, g.email, g.kelas
      ORDER BY g.nama
    `) as any[]

    // Get class reports
    const classReports = await query(`
      SELECT
        s.kelas,
        COUNT(DISTINCT s.id) as total_siswa,
        COUNT(DISTINCT CASE WHEN ht.status = 'selesai' THEN ht.id END) as siswa_selesai_tes,
        COUNT(DISTINCT CASE WHEN ht.status IS NULL OR ht.status != 'selesai' THEN s.id END) as siswa_belum_tes,
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
      WHERE s.role = 'siswa'
      LEFT JOIN hasil_tes ht ON ht.siswa_id = s.id
      GROUP BY s.kelas
      ORDER BY s.kelas
    `) as any[]

    return NextResponse.json({
      overallStats: overallStats[0] ? {
        total_guru: Number(overallStats[0].total_guru),
        total_siswa: Number(overallStats[0].total_siswa),
        total_selesai_tes: Number(overallStats[0].total_selesai_tes),
        total_belum_tes: Number(overallStats[0].total_belum_tes),
        rata_rata_skor_keseluruhan: Number(overallStats[0].rata_rata_skor_keseluruhan),
        kelas_aktif: Number(overallStats[0].kelas_aktif),
      } : null,
      guruReports: guruReports.map((r: any) => ({
        id: Number(r.id),
        nama_guru: r.nama_guru,
        email: r.email,
        total_siswa: Number(r.total_siswa),
        siswa_selesai_tes: Number(r.siswa_selesai_tes),
        siswa_belum_tes: Number(r.siswa_belum_tes),
        rata_rata_skor: Number(r.rata_rata_skor),
        laporan_terakhir: r.laporan_terakhir,
      })),
      classReports: classReports.map((r: any) => ({
        kelas: r.kelas,
        total_siswa: Number(r.total_siswa),
        siswa_selesai_tes: Number(r.siswa_selesai_tes),
        siswa_belum_tes: Number(r.siswa_belum_tes),
        rata_rata_skor: Number(r.rata_rata_skor),
        jurusan_populer: r.jurusan_populer || 'Belum ada data',
      })),
      userName: user.nama,
    })

  } catch (error) {
    console.error("Error fetching kepala sekolah statistics:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
