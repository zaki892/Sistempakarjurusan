import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "kepala_sekolah" && user.role !== "guru")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get distinct classes from users table where role is 'siswa'
    const classes = await query(`
      SELECT DISTINCT kelas
      FROM users
      WHERE role = 'siswa' AND kelas IS NOT NULL AND kelas != ''
      ORDER BY kelas ASC
    `) as any[]

    return NextResponse.json({
      classes: classes.map((row: any) => row.kelas)
    })
  } catch (error) {
    console.error("Get classes error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
