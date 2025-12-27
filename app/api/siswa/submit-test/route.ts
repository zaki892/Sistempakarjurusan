import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { calculateSAWScore } from "@/lib/saw-algorithm"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { answers } = await request.json()

    const result = await calculateSAWScore(answers, user.id)

    // Create notification for test completion
    await query(
      "INSERT INTO notifikasi (siswa_id, judul, pesan, tipe, dibaca, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [
        user.id,
        "Hasil Tes Tersedia",
        `Selamat! Hasil tes minat bakat Anda telah selesai diproses. Jurusan rekomendasi: ${result.bestMajor?.nama || 'Tidak dapat ditentukan'}.`,
        "hasil_tes",
        false,
      ]
    )

    return NextResponse.json({
      testId: result.hasilTesId,
      bestMajor: result.bestMajor,
      message: "Tes berhasil diproses",
    })
  } catch (error) {
    console.error("Submit test error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
