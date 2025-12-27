"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Trophy, TrendingUp } from "lucide-react"

interface HistoryItem {
  id: number
  tanggal_tes: string
  skor_akhir: number
  jurusan_rekomendasi: string
  status: string
}

export default function RiwayatTes() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/siswa/riwayat")
        if (!response.ok) {
          throw new Error("Failed to fetch history")
        }
        const data = await response.json()
        setHistory(data.history)
        setUserName(data.userName)
      } catch (err) {
        setError("Gagal memuat riwayat tes")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName={userName || "Siswa"} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Memuat riwayat tes...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName={userName || "Siswa"} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8 text-red-500">{error}</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName={userName || "Siswa"} />

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Riwayat Tes</h1>
              <p className="text-muted-foreground mt-1">Lihat semua hasil tes yang telah Anda lakukan</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Total Tes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{history.length}</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Skor Tertinggi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {history.length > 0 ? Math.max(...history.map(h => h.skor_akhir)).toFixed(2) : "0.00"}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Rata-rata Skor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {history.length > 0 ? (history.reduce((sum, h) => sum + h.skor_akhir, 0) / history.length).toFixed(2) : "0.00"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Table */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Riwayat Tes Lengkap</CardTitle>
                <CardDescription>Daftar semua tes yang telah Anda selesaikan</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada riwayat tes.</p>
                    <Link href="/siswa/tes">
                      <Button className="mt-4">Mulai Tes Pertama</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal Tes</TableHead>
                        <TableHead>Skor Akhir</TableHead>
                        <TableHead>Jurusan Rekomendasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{new Date(item.tanggal_tes).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="font-medium">{item.skor_akhir.toFixed(2)}</TableCell>
                          <TableCell>{item.jurusan_rekomendasi || "Tidak ada"}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === "selesai" ? "default" : "secondary"}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/siswa/hasil/${item.id}`}>
                              <Button variant="outline" size="sm">
                                Lihat Detail
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
