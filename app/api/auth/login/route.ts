import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { createToken, setAuthCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password harus diisi" }, { status: 400 })
    }

    console.log("[v0] Login attempt for email:", email)

    // Find user
    const users = (await query("SELECT * FROM users WHERE email = ?", [email])) as any[]

    if (users.length === 0) {
      console.log("[v0] User not found:", email)
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    const user = users[0]
    console.log("[v0] User found:", { id: user.id, email: user.email, role: user.role })

    console.log("[v0] Checking password...")
    console.log("[v0] Password input length:", password.length)
    console.log("[v0] Hash from DB:", user.password.substring(0, 30) + "...")

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)

    console.log("[v0] Password match result:", passwordMatch)

    if (!passwordMatch) {
      console.log("[v0] Password mismatch for user:", email)
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    // Create token
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      nama: user.nama,
      kelas: user.kelas,
    })

    // Update last login
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

    // Create login notification for siswa
    if (user.role === "siswa") {
      await query(
        "INSERT INTO notifikasi (siswa_id, judul, pesan, tipe, dibaca, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [
          user.id,
          "Login Berhasil",
          `Selamat datang kembali, ${user.nama}! Anda telah berhasil login ke sistem.`,
          "login",
          false,
        ]
      )
    }

    console.log("[v0] Login successful for user:", email)

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: "Login berhasil",
      role: user.role,
      nama: user.nama,
    })
  } catch (error) {
    console.error("[v0] Login error:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Full error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
