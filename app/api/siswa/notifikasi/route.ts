import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    let sql = "SELECT * FROM notifikasi WHERE siswa_id = ?"
    const values: any[] = [user.id]

    if (unreadOnly) {
      sql += " AND dibaca = FALSE"
    }

    sql += " ORDER BY created_at DESC"

    const notifications = await query(sql, values)

    return NextResponse.json({ notifications, userName: user.nama })
  } catch (error) {
    console.error("Notification fetch error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { notifikasiId } = await request.json()

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
