import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "siswa") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    // Get jurusan information for context
    const jurusanResults = (await query("SELECT nama, deskripsi FROM jurusan LIMIT 5")) as any[]
    const jurusanContext = jurusanResults.map((j: any) => `${j.nama}: ${j.deskripsi}`).join("\n")

    // Simple mock response for now - replace with actual AI integration later
    const responses = [
      `Halo! Terima kasih atas pertanyaan Anda tentang "${message}". Berdasarkan sistem penentuan jurusan SAW yang kami gunakan, saya dapat membantu Anda memahami berbagai jurusan yang tersedia.`,
      `Pertanyaan bagus! "${message}" adalah topik penting dalam pemilihan jurusan. Mari saya jelaskan lebih detail tentang jurusan-jurusan yang sesuai dengan minat Anda.`,
      `Saya mengerti Anda bertanya tentang "${message}". Sistem kami menggunakan metode SAW untuk memberikan rekomendasi jurusan yang akurat berdasarkan jawaban tes Anda.`,
      `Untuk menjawab pertanyaan Anda tentang "${message}", berikut adalah informasi tentang jurusan-jurusan yang mungkin cocok: ${jurusanContext.split('\n').slice(0, 2).join(', ')}.`
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Save chat history asynchronously
    await query("INSERT INTO chat_history (siswa_id, pertanyaan, jawaban) VALUES (?, ?, ?)", [
      user.id,
      message,
      randomResponse,
    ])

    return new Response(randomResponse, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
