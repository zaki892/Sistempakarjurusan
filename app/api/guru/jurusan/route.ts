import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const jurusanResults = (await query(
      `SELECT id, nama, deskripsi, kode_jurusan FROM jurusan ORDER BY nama`,
    )) as any[]

    return NextResponse.json({
      jurusan: jurusanResults,
      userName: user.nama,
    })
  } catch (error) {
    console.error("Jurusan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { nama, deskripsi, kode_jurusan } = await request.json()

    if (!nama) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`INSERT INTO jurusan (nama, deskripsi, kode_jurusan) VALUES (?, ?, ?)`, [
      nama,
      deskripsi || "",
      kode_jurusan || "",
    ])

    return NextResponse.json({ message: "Jurusan created successfully", success: true })
  } catch (error) {
    console.error("Create jurusan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, nama, deskripsi, kode_jurusan } = await request.json()

    if (!id || !nama) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`UPDATE jurusan SET nama = ?, deskripsi = ?, kode_jurusan = ? WHERE id = ?`, [
      nama,
      deskripsi || "",
      kode_jurusan || "",
      id,
    ])

    return NextResponse.json({ message: "Jurusan updated successfully", success: true })
  } catch (error) {
    console.error("Update jurusan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const idStr = searchParams.get("id")
    const id = parseInt(idStr || "0", 10)

    if (!id || id <= 0) {
      return NextResponse.json({ message: "Missing or invalid jurusan ID" }, { status: 400 })
    }

    // Delete related records first
    await query(`DELETE FROM skor_saw WHERE jurusan_id = ?`, [id])
    await query(`DELETE FROM jurusan_aspek WHERE jurusan_id = ?`, [id])
    await query(`DELETE FROM hasil_tes WHERE jurusan_rekomendasi_id = ?`, [id])
    // Then delete jurusan
    await query(`DELETE FROM jurusan WHERE id = ?`, [id])

    return NextResponse.json({ message: "Jurusan deleted successfully", success: true })
  } catch (error) {
    console.error("Delete jurusan error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
