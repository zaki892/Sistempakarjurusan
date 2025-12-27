"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import StudentHeader from "@/components/student-header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"


interface User {
  nama: string
  last_login?: string
}



export default function SiswaDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({ tests: 0, latestTest: null })
  const [loading, setLoading] = useState(true)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info
        const response = await fetch("/api/siswa/profile")
        const data = await response.json()
        setUser(data.user)
        setStats(data.stats)


      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName={user?.nama || "Siswa"} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <StudentHeader
          userName={user?.nama || "Siswa"}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          isMenuOpen={isMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-20 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Selamat Datang, {user?.nama}!</h1>
              <p className="text-muted-foreground mt-1">Dashboard Sistem Pakar Penentuan Jurusan</p>
            </div>

            {/* Notification */}
            {user?.last_login && (
              <Alert>
                <AlertDescription>Terakhir login: {new Date(user.last_login).toLocaleString("id-ID")}</AlertDescription>
              </Alert>
            )}



            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Tes Selesai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.tests}</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Status Tes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">{stats.tests > 0 ? "Selesai" : "Belum"}</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{stats.tests > 0 ? "100%" : "0%"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Test */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Lakukan Tes Minat Bakat</CardTitle>
                  <CardDescription>Mulai tes untuk mendapatkan rekomendasi jurusan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tes ini terdiri dari beberapa pertanyaan untuk mengidentifikasi minat dan bakat Anda. Waktu tes
                    kurang lebih 20-30 menit.
                  </p>
                  <Link href="/siswa/tes">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Mulai Tes</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* View History */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Lihat Riwayat Tes</CardTitle>
                  <CardDescription>Akses hasil tes sebelumnya</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Lihat semua hasil tes Anda, rekomendasi jurusan, dan skor detail yang telah diperoleh.
                  </p>
                  <Link href="/siswa/riwayat">
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Riwayat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Chatbot */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Tanya Chatbot</CardTitle>
                  <CardDescription>Dapatkan informasi tentang jurusan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bertanyalah kepada AI chatbot kami tentang berbagai jurusan dan karir yang tersedia.
                  </p>
                  <Link href="/siswa/chatbot">
                    <Button variant="outline" className="w-full bg-transparent">
                      Buka Chatbot
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Major Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Informasi Jurusan</CardTitle>
                  <CardDescription>Pelajari tentang setiap jurusan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Jelajahi detail lengkap tentang semua jurusan yang tersedia di universitas.
                  </p>
                  <Link href="/siswa/jurusan">
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Jurusan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Info Section */}
            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle>Informasi Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  📌 <strong>Metode SAW:</strong> Sistem ini menggunakan metode Simple Additive Weighting untuk
                  memberikan rekomendasi jurusan yang akurat berdasarkan jawaban Anda.
                </p>
                <p className="text-sm text-muted-foreground">
                  📌 <strong>Kerahasiaan:</strong> Data Anda dijaga dengan ketat dan hanya dapat diakses oleh Anda dan
                  guru pembimbing.
                </p>
                <p className="text-sm text-muted-foreground">
                  📌 <strong>Bantuan:</strong> Jika ada pertanyaan atau masalah, hubungi guru pembimbing Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
