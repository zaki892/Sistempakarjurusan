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

    // Get statistics
    const siswaCount = (await query("SELECT COUNT(*) as count FROM users WHERE role = ? AND kelas = ?", ["siswa", guruKelas])) as any[]
    const soalCount = (await query("SELECT COUNT(*) as count FROM soal")) as any[]
    const jurusanCount = (await query("SELECT COUNT(*) as count FROM jurusan")) as any[]
    const hasilCount = (await query("SELECT COUNT(*) as count FROM hasil_tes ht LEFT JOIN users u ON ht.siswa_id = u.id WHERE ht.status = ? AND u.kelas = ?", ["selesai", guruKelas])) as any[]

    // Get list of test results with student info
    const results = (await query(`
      SELECT
        ht.id,
        ht.tanggal_tes,
        ht.skor_akhir,
        ht.status,
        ht.jurusan_rekomendasi_id,
        u.nama as siswa_nama,
        u.no_induk,
        u.kelas,
        j.nama as jurusan_rekomendasi
      FROM hasil_tes ht
      LEFT JOIN users u ON ht.siswa_id = u.id
      LEFT JOIN jurusan j ON ht.jurusan_rekomendasi_id = j.id
      WHERE ht.status = 'selesai' AND u.kelas = ?
      ORDER BY ht.tanggal_tes DESC
    `, [guruKelas])) as any[]

    // Get list of jurusan for edit dropdown
    const jurusanList = (await query("SELECT id, nama FROM jurusan ORDER BY nama")) as any[]

    return NextResponse.json({
      stats: {
        totalSiswa: siswaCount[0]?.count || 0,
        totalSoal: soalCount[0]?.count || 0,
        totalJurusan: jurusanCount[0]?.count || 0,
        totalHasil: hasilCount[0]?.count || 0,
        kelas: guruKelas,
      },
      results: results.map((r: any) => ({
        id: Number(r.id),
        tanggal_tes: r.tanggal_tes,
        skor_akhir: Number(r.skor_akhir) || 0,
        status: r.status,
        jurusan_rekomendasi_id: Number(r.jurusan_rekomendasi_id),
        siswa: {
          nama: r.siswa_nama,
          no_induk: r.no_induk,
          kelas: r.kelas,
        },
        jurusan_rekomendasi: r.jurusan_rekomendasi,
      })),
      jurusan: jurusanList.map((j: any) => ({ id: Number(j.id), nama: j.nama })),
      userName: user.nama,
    })
  } catch (error) {
    console.error("Laporan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, jurusan_rekomendasi_id, skor_akhir } = await request.json()

    if (!id) {
      return NextResponse.json({ message: "Missing test result ID" }, { status: 400 })
    }

    await query(`UPDATE hasil_tes SET jurusan_rekomendasi_id = ?, skor_akhir = ? WHERE id = ?`, [
      jurusan_rekomendasi_id,
      skor_akhir,
      id,
    ])

    return NextResponse.json({ message: "Test result updated successfully", success: true })
  } catch (error) {
    console.error("Update test result error:", error)
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
    const idStr = searchParams.get("id")
    const id = parseInt(idStr || "0", 10)

    if (!id || id <= 0) {
      return NextResponse.json({ message: "Missing or invalid test result ID" }, { status: 400 })
    }

    // Delete related records first
    await query(`DELETE FROM skor_saw WHERE hasil_tes_id = ?`, [id])
    // Then delete test result
    await query(`DELETE FROM hasil_tes WHERE id = ?`, [id])

    return NextResponse.json({ message: "Test result deleted successfully", success: true })
  } catch (error) {
    console.error("Delete test result error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
