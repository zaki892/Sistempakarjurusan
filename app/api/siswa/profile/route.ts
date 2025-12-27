import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const users = (await query("SELECT id, email, nama, no_induk, kelas, role, created_at, last_login FROM users WHERE id = ?", [user.id])) as any[]
    const tesResults = (await query("SELECT COUNT(*) as count FROM hasil_tes WHERE siswa_id = ? AND status = ?", [
      user.id,
      "selesai",
    ])) as any[]

    return NextResponse.json({
      user: users[0],
      stats: {
        tests: tesResults[0]?.count || 0,
        latestTest: null,
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { nama, email } = await request.json()

    if (!nama || !email) {
      return NextResponse.json({ message: "Nama dan email harus diisi" }, { status: 400 })
    }

    // Update user profile
    await query("UPDATE users SET nama = ?, email = ? WHERE id = ?", [nama, email, user.id])

    return NextResponse.json({ message: "Profil berhasil diperbarui" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
