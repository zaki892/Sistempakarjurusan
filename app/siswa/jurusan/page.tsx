"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Jurusan {
  id: number
  nama: string
  kode_jurusan: string
  deskripsi: string
}

export default function JurusanPage() {
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchJurusan = async () => {
      try {
        const res = await fetch("/api/siswa/jurusan")
        const data = await res.json()
        setJurusan(data.jurusan)
        setUserName(data.userName)
      } catch (error) {
        console.error("Failed to load jurusan:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJurusan()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Memuat jurusan...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName={userName} />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Informasi Jurusan</h1>
              <p className="text-muted-foreground mt-1">Pelajari detail lengkap tentang setiap jurusan</p>
            </div>

            {/* Jurusan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jurusan.map((j) => (
                <Card key={j.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-primary">{j.nama}</CardTitle>
                    <p className="text-xs text-muted-foreground">{j.kode_jurusan}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground leading-relaxed">{j.deskripsi}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {jurusan.length === 0 && (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Belum ada data jurusan tersedia.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
