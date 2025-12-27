import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const jurusanResults = (await query("SELECT id, nama, kode_jurusan, deskripsi FROM jurusan ORDER BY nama")) as any[]

    return NextResponse.json({
      jurusan: jurusanResults,
      userName: user.nama,
    })
  } catch (error) {
    console.error("Jurusan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
