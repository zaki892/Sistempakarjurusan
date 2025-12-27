import { type NextRequest, NextResponse } from "next/server"
import { removeAuthCookie, getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Get user before logout for notification
    const user = await getCurrentUser()

    // Create logout notification for siswa
    if (user && user.role === "siswa") {
      await query(
        "INSERT INTO notifikasi (siswa_id, judul, pesan, tipe, dibaca, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [
          user.id,
          "Logout Berhasil",
          `Terima kasih telah menggunakan sistem, ${user.nama}. Anda telah berhasil logout.`,
          "logout",
          false,
        ]
      )
    }

    await removeAuthCookie()
    return NextResponse.json({ message: "Logout berhasil" })
  } catch (error) {
    console.error("Logout error:", error)
    await removeAuthCookie()
    return NextResponse.json({ message: "Logout berhasil" })
  }
}
