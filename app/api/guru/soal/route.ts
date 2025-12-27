import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const soalResults = (await query(`
      SELECT s.id, s.pertanyaan, s.aspek_id, a.nama as aspek_nama
      FROM soal s
      JOIN aspek a ON s.aspek_id = a.id
      ORDER BY s.urutan, s.id
    `)) as any[]

    return NextResponse.json({
      soal: soalResults,
      userName: user.nama,
    })
  } catch (error) {
    console.error("Soal error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { pertanyaan, aspek_id } = await request.json()

    if (!pertanyaan || !aspek_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`INSERT INTO soal (pertanyaan, aspek_id) VALUES (?, ?)`, [pertanyaan, aspek_id])

    return NextResponse.json({ message: "Soal created successfully", success: true })
  } catch (error) {
    console.error("Create soal error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, pertanyaan, aspek_id } = await request.json()

    if (!id || !pertanyaan || !aspek_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`UPDATE soal SET pertanyaan = ?, aspek_id = ? WHERE id = ?`, [pertanyaan, aspek_id, id])

    return NextResponse.json({ message: "Soal updated successfully", success: true })
  } catch (error) {
    console.error("Update soal error:", error)
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
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "Missing soal ID" }, { status: 400 })
    }

    // Delete related jawaban_tes first
    await query(`DELETE FROM jawaban_tes WHERE soal_id = ?`, [id])
    // Delete related pilihan_soal
    await query(`DELETE FROM pilihan_soal WHERE soal_id = ?`, [id])
    // Then delete soal
    await query(`DELETE FROM soal WHERE id = ?`, [id])

    return NextResponse.json({ message: "Soal deleted successfully", success: true })
  } catch (error) {
    console.error("Delete soal error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
