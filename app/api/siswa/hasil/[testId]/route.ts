import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      console.error("Unauthorized access attempt:", { user: user ? user.role : null })
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { testId } = await params
    const testIdNum = parseInt(testId)
    if (isNaN(testIdNum)) {
      console.error("Invalid test ID format:", params.testId)
      return NextResponse.json({ message: "Invalid test ID" }, { status: 400 })
    }

    console.log("Fetching result for user:", user.id, "testId:", testIdNum)

    // Get hasil tes
    const results = (await query(
      `SELECT ht.*, j.nama as jurusan_nama, j.deskripsi as jurusan_deskripsi
       FROM hasil_tes ht
       LEFT JOIN jurusan j ON ht.jurusan_rekomendasi_id = j.id
       WHERE ht.id = ? AND ht.siswa_id = ?`,
      [testIdNum, user.id],
    )) as any[]

    console.log("Query results:", results.length, "records found")

    if (!results.length) {
      console.error("No result found for user:", user.id, "testId:", testIdNum)
      return NextResponse.json({ message: "Result not found" }, { status: 404 })
    }

    const hasilTes = results[0]

    if (hasilTes.status !== 'selesai') {
      return NextResponse.json({ message: "Test not completed" }, { status: 404 })
    }

    // Get scores for all majors
    const scoreResults = (await query(
      `SELECT j.nama, ss.skor FROM skor_saw ss
       LEFT JOIN jurusan j ON ss.jurusan_id = j.id
       WHERE ss.hasil_tes_id = ?
       ORDER BY ss.skor DESC`,
      [testIdNum],
    )) as any[]

    return NextResponse.json({
      result: {
        id: Number(hasilTes.id),
        skor_akhir: Number(hasilTes.skor_akhir) || 0,
        tanggal_tes: hasilTes.tanggal_tes,
        jurusan_rekomendasi: {
          id: Number(hasilTes.jurusan_rekomendasi_id) || 0,
          nama: hasilTes.jurusan_nama,
          deskripsi: hasilTes.jurusan_deskripsi,
        },
        scoresByMajor: scoreResults.map((r: any) => ({
          jurusan: r.nama,
          skor: Number(r.skor) || 0,
        })),
      },
      userName: user.nama,
    })
  } catch (error) {
    console.error("Get result error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
