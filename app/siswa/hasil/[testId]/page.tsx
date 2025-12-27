"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Result {
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

export default function SiswaHasilDetail() {
  const params = useParams()
  const testId = params.testId as string

  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultRes = await fetch(`/api/siswa/hasil/${testId}`)
        if (!resultRes.ok) {
          if (resultRes.status === 404) {
            throw new Error("Hasil tes tidak ditemukan")
          }
          throw new Error("Failed to fetch result")
        }
        const resultData = await resultRes.json()
        setResult(resultData.result)
        setUserName(resultData.userName)
      } catch (err) {
        console.error("Error fetching result:", err)
        setError((err as Error)?.message || "Gagal memuat hasil tes")
      } finally {
        setLoading(false)
      }
    }

    if (testId) {
      fetchResult()
    }
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
            <Alert className="max-w-2xl mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="text-center mt-4">
              <Link href="/siswa/riwayat">
                <Button variant="outline">Lihat Riwayat Tes</Button>
              </Link>
            </div>
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
            <Alert className="max-w-2xl mx-auto">
              <AlertDescription>Tidak ada hasil tes ditemukan</AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName={userName} />

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hasil Tes Minat Bakat</h1>
              <p className="text-muted-foreground mt-1">Rekomendasi jurusan berdasarkan hasil tes Anda</p>
            </div>

            {/* Recommended Major */}
            <Card className="border-border bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">Jurusan Rekomendasi</CardTitle>
                    <CardDescription>Jurusan yang paling cocok berdasarkan skor SAW</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{result.jurusan_rekomendasi.nama}</h3>
                    <p className="text-muted-foreground mt-1">{result.jurusan_rekomendasi.deskripsi}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Skor: {result.skor_akhir.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Test Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    <CardTitle>Tanggal Tes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">
                    {new Date(result.tanggal_tes).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    <CardTitle>Skor Akhir</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{result.skor_akhir.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            {/* All Scores */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Skor untuk Semua Jurusan</CardTitle>
                <CardDescription>Perbandingan skor SAW untuk setiap jurusan</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jurusan</TableHead>
                      <TableHead className="text-right">Skor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.scoresByMajor.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {score.jurusan}
                          {score.jurusan === result.jurusan_rekomendasi.nama && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Rekomendasi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">{score.skor.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/siswa/riwayat">
                <Button variant="outline">Lihat Riwayat Tes</Button>
              </Link>
              <Link href="/siswa/jurusan">
                <Button variant="outline">Pelajari Jurusan</Button>
              </Link>
              <Link href="/siswa/chatbot">
                <Button>Tanya Chatbot</Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
