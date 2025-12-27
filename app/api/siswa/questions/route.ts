import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const soalResults = (await query(
      `SELECT s.id, s.pertanyaan, s.urutan, s.aspek_id
       FROM soal s
       ORDER BY s.aspek_id, s.urutan`,
    )) as any[]

    const questions = []
    for (const soal of soalResults) {
      const pilihanResults = (await query(
        "SELECT id, teks, nilai FROM pilihan_soal WHERE soal_id = ? ORDER BY urutan",
        [soal.id],
      )) as any[]

      questions.push({
        id: soal.id,
        pertanyaan: soal.pertanyaan,
        options: pilihanResults,
      })
    }

    return NextResponse.json({
      questions,
      userName: user.nama,
    })
  } catch (error) {
    console.error("Questions error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
