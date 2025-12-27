"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Users, FileText, BookOpen } from "lucide-react"

interface DashboardStats {
  totalSiswa: number
  totalSoal: number
  totalJurusan: number
  totalHasil: number
  kelas?: string
}

export default function GuruDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSiswa: 0,
    totalSoal: 0,
    totalJurusan: 0,
    totalHasil: 0,
    kelas: "",
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [guruKelas, setGuruKelas] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/guru/stats")
        const data = await res.json()
        setStats({ ...data.stats, kelas: data.kelas })
        setUserName(data.userName)
        setGuruKelas(data.kelas)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminSidebar userName={userName} role="guru" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Guru</h1>
              <p className="text-muted-foreground mt-1">Kelas: {guruKelas} | Kelola sistem pakar dan data siswa</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">{stats?.totalSiswa || 0}</div>
                  <Users className="w-8 h-8 text-primary/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Soal</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-secondary">{stats?.totalSoal || 0}</div>
                  <FileText className="w-8 h-8 text-secondary/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Jurusan</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-accent">{stats?.totalJurusan || 0}</div>
                  <BookOpen className="w-8 h-8 text-accent/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hasil Tes</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">{stats?.totalHasil || 0}</div>
                  <BarChart3 className="w-8 h-8 text-green-600/20" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Kelola Siswa</CardTitle>
                  <CardDescription>Tambah, edit, atau hapus data siswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/guru/siswa">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Buka Kelola Siswa
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Kelola Soal Tes</CardTitle>
                  <CardDescription>Tambah atau edit soal tes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/guru/soal">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Buka Kelola Soal
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Kelola Jurusan & Bobot</CardTitle>
                  <CardDescription>Atur jurusan dan bobot aspek</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/guru/jurusan">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Buka Kelola Jurusan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Lihat Hasil Tes</CardTitle>
                  <CardDescription>Analisis hasil tes siswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/guru/hasil">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Lihat Hasil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
