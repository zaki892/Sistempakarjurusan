import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notifikasiId = parseInt(params.id)

    // Verify notification belongs to user
    const notification = (await query("SELECT * FROM notifikasi WHERE id = ? AND siswa_id = ?", [
      notifikasiId,
      user.id,
    ])) as any[]

    if (notification.length === 0) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    await query("UPDATE notifikasi SET dibaca = TRUE WHERE id = ?", [notifikasiId])

    return NextResponse.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
