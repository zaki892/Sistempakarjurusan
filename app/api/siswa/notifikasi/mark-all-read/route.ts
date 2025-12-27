import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await query("UPDATE notifikasi SET dibaca = TRUE WHERE siswa_id = ?", [user.id])

    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
