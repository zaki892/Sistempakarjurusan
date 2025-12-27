"use client"

import { CardDescription } from "@/components/ui/card"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Users, TrendingUp } from "lucide-react"

interface PrincipalStats {
  totalSiswa: number
  siswaSelesaiTes: number
  totalJurusan: number
  totalGuru: number
  averageScore: number
}

export default function KepalaSekolahDashboard() {
  const [stats, setStats] = useState<PrincipalStats>({
    totalSiswa: 0,
    siswaSelesaiTes: 0,
    totalJurusan: 0,
    totalGuru: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/kepala-sekolah/stats")
        const data = await res.json()
        setStats(data.stats)
        setUserName(data.userName)
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
      <AdminSidebar userName={userName} role="kepala_sekolah" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Kepala Sekolah</h1>
              <p className="text-muted-foreground mt-1">Pantau dan analisis hasil sistem pakar</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Siswa</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">{stats.totalSiswa}</div>
                  <Users className="w-8 h-8 text-primary/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Guru</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalGuru}</div>
                  <Users className="w-8 h-8 text-blue-600/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Siswa Selesai Tes</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-secondary">{stats.siswaSelesaiTes}</div>
                  <TrendingUp className="w-8 h-8 text-secondary/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Jurusan</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-accent">{stats.totalJurusan}</div>
                  <BarChart3 className="w-8 h-8 text-accent/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Skor</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">{stats.averageScore.toFixed(2)}</div>
                  <TrendingUp className="w-8 h-8 text-green-600/20" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Statistik Hasil Tes</CardTitle>
                  <CardDescription>Lihat analisis komprehensif hasil tes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/kepala-sekolah/statistik">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Lihat Statistik
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Laporan Per Kelas</CardTitle>
                  <CardDescription>Cetak laporan hasil tes per kelas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/kepala-sekolah/laporan">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Lihat Laporan
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
