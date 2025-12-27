import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const aspekResults = (await query(`SELECT id, nama, deskripsi FROM aspek ORDER BY nama`)) as any[]

    return NextResponse.json({
      aspek: aspekResults,
      userName: user.nama,
    })
  } catch (error) {
    console.error("Aspek error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { nama, deskripsi } = await request.json()

    if (!nama) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`INSERT INTO aspek (nama, deskripsi) VALUES (?, ?)`, [nama, deskripsi || ""])

    return NextResponse.json({ message: "Aspek created successfully", success: true })
  } catch (error) {
    console.error("Create aspek error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "guru") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, nama, deskripsi } = await request.json()

    if (!id || !nama) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await query(`UPDATE aspek SET nama = ?, deskripsi = ? WHERE id = ?`, [nama, deskripsi || "", id])

    return NextResponse.json({ message: "Aspek updated successfully", success: true })
  } catch (error) {
    console.error("Update aspek error:", error)
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
      return NextResponse.json({ message: "Missing aspek ID" }, { status: 400 })
    }

    // Delete related bobot first
    await query(`DELETE FROM bobot_aspek WHERE aspek_id = ?`, [id])
    // Delete related soal
    await query(`DELETE FROM soal WHERE aspek_id = ?`, [id])
    // Then delete aspek
    await query(`DELETE FROM aspek WHERE id = ?`, [id])

    return NextResponse.json({ message: "Aspek deleted successfully", success: true })
  } catch (error) {
    console.error("Delete aspek error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
