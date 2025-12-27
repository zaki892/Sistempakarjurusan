"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Download, FileText, BarChart3, Users, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface GuruReport {
  id: number
  nama_guru: string
  email: string
  total_siswa: number
  siswa_selesai_tes: number
  siswa_belum_tes: number
  rata_rata_skor: number
  laporan_terakhir: string | null
}

interface ClassReport {
  kelas: string
  total_siswa: number
  siswa_selesai_tes: number
  siswa_belum_tes: number
  rata_rata_skor: number
  jurusan_populer: string
}

interface OverallStats {
  total_guru: number
  total_siswa: number
  total_selesai_tes: number
  total_belum_tes: number
  rata_rata_skor_keseluruhan: number
  kelas_aktif: number
}

export default function KepalaSekolahStatistik() {
  const [guruReports, setGuruReports] = useState<GuruReport[]>([])
  const [classReports, setClassReports] = useState<ClassReport[]>([])
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/kepala-sekolah/stats")
        const data = await res.json()
        setGuruReports(data.guruReports || [])
        setClassReports(data.classReports || [])
        setOverallStats(data.overallStats)
        setUserName(data.userName)
      } catch (error) {
        console.error("Failed to load statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handlePrintReport = (type: 'guru' | 'class') => {
    window.print()
  }

  const handleExportReport = (type: 'guru' | 'class') => {
    const data = type === 'guru' ? guruReports : classReports
    const csvContent = [
      type === 'guru'
        ? ["Nama Guru", "Email", "Total Siswa", "Siswa Selesai Tes", "Siswa Belum Tes", "Rata-rata Skor", "Laporan Terakhir"]
        : ["Kelas", "Total Siswa", "Siswa Selesai Tes", "Siswa Belum Tes", "Rata-rata Skor", "Jurusan Populer"],
      ...data.map(r => type === 'guru'
        ? [
            r.nama_guru,
            r.email,
            r.total_siswa.toString(),
            r.siswa_selesai_tes.toString(),
            r.siswa_belum_tes.toString(),
            r.rata_rata_skor.toFixed(2),
            r.laporan_terakhir ? new Date(r.laporan_terakhir).toLocaleDateString('id-ID') : '-'
          ]
        : [
            r.kelas,
            r.total_siswa.toString(),
            r.siswa_selesai_tes.toString(),
            r.siswa_belum_tes.toString(),
            r.rata_rata_skor.toFixed(2),
            r.jurusan_populer
          ]
      )
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statistik-${type}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredClassReports = selectedClass === 'all'
    ? classReports
    : classReports.filter(r => r.kelas === selectedClass)

  if (loading) {
    return <div className="text-center py-8">Memuat statistik...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminSidebar userName={userName} role="kepala_sekolah" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Statistik Sekolah</h1>
                <p className="text-muted-foreground mt-1">Ringkasan statistik keseluruhan sekolah</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleExportReport('guru')} variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Export Guru
                </Button>
                <Button onClick={() => handleExportReport('class')} variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Download className="w-4 h-4 mr-2" />
                  Export Kelas
                </Button>
              </div>
            </div>

            {/* Overall Statistics Cards */}
            {overallStats && (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.total_guru}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.total_siswa}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Selesai Tes</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{overallStats.total_selesai_tes}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Belum Tes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{overallStats.total_belum_tes}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.rata_rata_skor_keseluruhan.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overallStats.kelas_aktif}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Guru Reports */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Statistik Guru</CardTitle>
                <CardDescription>Ringkasan hasil tes yang dikelola oleh masing-masing guru</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Guru</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Siswa</TableHead>
                      <TableHead>Selesai Tes</TableHead>
                      <TableHead>Belum Tes</TableHead>
                      <TableHead>Rata-rata Skor</TableHead>
                      <TableHead>Laporan Terakhir</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guruReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Belum ada data statistik guru
                        </TableCell>
                      </TableRow>
                    ) : (
                      guruReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.nama_guru}</TableCell>
                          <TableCell>{report.email}</TableCell>
                          <TableCell>{report.total_siswa}</TableCell>
                          <TableCell className="text-green-600 font-medium">{report.siswa_selesai_tes}</TableCell>
                          <TableCell className="text-yellow-600 font-medium">{report.siswa_belum_tes}</TableCell>
                          <TableCell>{report.rata_rata_skor.toFixed(2)}</TableCell>
                          <TableCell>{report.laporan_terakhir ? new Date(report.laporan_terakhir).toLocaleDateString('id-ID') : '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintReport('guru')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Cetak
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Class Reports */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Statistik Per Kelas</CardTitle>
                    <CardDescription>Ringkasan statistik berdasarkan kelas</CardDescription>
                  </div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classReports.map(r => (
                        <SelectItem key={r.kelas} value={r.kelas}>{r.kelas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Total Siswa</TableHead>
                      <TableHead>Selesai Tes</TableHead>
                      <TableHead>Belum Tes</TableHead>
                      <TableHead>Rata-rata Skor</TableHead>
                      <TableHead>Jurusan Populer</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClassReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Belum ada data statistik kelas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClassReports.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{report.kelas}</TableCell>
                          <TableCell>{report.total_siswa}</TableCell>
                          <TableCell className="text-green-600 font-medium">{report.siswa_selesai_tes}</TableCell>
                          <TableCell className="text-yellow-600 font-medium">{report.siswa_belum_tes}</TableCell>
                          <TableCell>{report.rata_rata_skor.toFixed(2)}</TableCell>
                          <TableCell>{report.jurusan_populer}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintReport('class')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Cetak
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
