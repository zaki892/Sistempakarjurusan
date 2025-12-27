import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse, type NextRequest } from "next/server"

// Guru/Admin can send notifications to students
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { siswaId, judul, pesan, tipe } = await request.json()

    if (!siswaId || !judul || !pesan) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Verify student exists
    const student = (await query("SELECT id FROM users WHERE id = ? AND role = 'siswa'", [siswaId])) as any[]
    if (student.length === 0) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    await query("INSERT INTO notifikasi (siswa_id, judul, pesan, tipe) VALUES (?, ?, ?, ?)", [
      siswaId,
      judul,
      pesan,
      tipe || "info",
    ])

    return NextResponse.json({ message: "Notification sent successfully" })
  } catch (error) {
    console.error("Notification send error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
