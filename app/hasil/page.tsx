"use client"

import { useEffect, useState } from "react"

export const dynamic = 'force-dynamic'
import { useSearchParams } from "next/navigation"
import StudentSidebar from "@/components/student-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Trophy, TrendingUp, ArrowLeft } from "lucide-react"

interface ResultData {
  id: number
  skor_akhir: number
  tanggal_tes: string
  jurusan_rekomendasi: {
    id: number
    nama: string
    deskripsi: string
  }
  scoresByMajor: {
    jurusan: string
    skor: number
  }[]
}

export default function HasilTes() {
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")

  const [result, setResult] = useState<ResultData | null>(null)
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!testId) {
      setError("Test ID tidak ditemukan")
      setLoading(false)
      return
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/siswa/hasil/${testId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch result")
        }
        const data = await response.json()
        setResult(data.result)
        setUserName(data.userName)
      } catch (err) {
        setError("Gagal memuat hasil tes")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [testId])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName={userName || "Siswa"} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Memuat hasil tes...</div>
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

  if (!result) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName={userName || "Siswa"} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8 text-muted-foreground">Hasil tes tidak ditemukan.</div>
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
            <div className="flex items-center gap-4">
              <Link href="/siswa/riwayat">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Riwayat
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Hasil Tes</h1>
                <p className="text-muted-foreground mt-1">Detail hasil tes yang telah Anda selesaikan</p>
              </div>
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal Tes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-primary">
                    {new Date(result.tanggal_tes).toLocaleDateString("id-ID")}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Skor Akhir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {result.skor_akhir.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Jurusan Rekomendasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-accent">
                    {result.jurusan_rekomendasi.nama || "Tidak ada"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Major Details */}
            {result.jurusan_rekomendasi.nama && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Jurusan Rekomendasi</CardTitle>
                  <CardDescription>Detail jurusan yang direkomendasikan berdasarkan hasil tes Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{result.jurusan_rekomendasi.nama}</h3>
                      <p className="text-muted-foreground mt-2">{result.jurusan_rekomendasi.deskripsi}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scores by Major */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Skor untuk Semua Jurusan</CardTitle>
                <CardDescription>Perbandingan skor Anda di semua jurusan yang tersedia</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jurusan</TableHead>
                      <TableHead>Skor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.scoresByMajor.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{score.jurusan}</TableCell>
                        <TableCell>{score.skor.toFixed(2)}</TableCell>
                        <TableCell>
                          {score.jurusan === result.jurusan_rekomendasi.nama ? (
                            <Badge variant="default">Rekomendasi</Badge>
                          ) : (
                            <Badge variant="secondary">-</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

