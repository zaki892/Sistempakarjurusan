import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "kepala_sekolah") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email, nama, kelas, password } = await request.json()
    const { id: guruId } = await params

    if (!email || !nama || !kelas) {
      return NextResponse.json({ message: "Email, nama, dan kelas harus diisi" }, { status: 400 })
    }

    // Check if email already exists (excluding current user)
    const existingUser = await query("SELECT id FROM users WHERE email = ? AND id != ?", [email, guruId]) as any[]
    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 })
    }

    // Prepare update data
    let updateData: any = { email, nama, kelas }
    let updateFields = "email = ?, nama = ?, kelas = ?"
    let updateValues = [email, nama, kelas]

    // Only update password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
      updateData.original_password = password
      updateFields += ", password = ?, original_password = ?"
      updateValues.push(hashedPassword, password)
    }

    updateValues.push(guruId)

    // Update guru
    await query(
      `UPDATE users SET ${updateFields} WHERE id = ? AND role = 'guru'`,
      updateValues
    )

    return NextResponse.json({ message: "Guru berhasil diperbarui" })
  } catch (error) {
    console.error("Update guru error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "kepala_sekolah") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: guruId } = await params

    // Delete guru
    await query("DELETE FROM users WHERE id = ? AND role = 'guru'", [guruId])

    return NextResponse.json({ message: "Guru berhasil dihapus" })
  } catch (error) {
    console.error("Delete guru error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
