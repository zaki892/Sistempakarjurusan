"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Download, FileText } from "lucide-react"

interface GuruReport {
  id: number
  nama_guru: string
  email: string
  total_siswa: number
  siswa_selesai_tes: number
  rata_rata_skor: number
  laporan_terakhir: string
}

interface ClassReport {
  kelas: string
  total_siswa: number
  siswa_selesai_tes: number
  rata_rata_skor: number
  jurusan_populer: string
}

interface StudentReport {
  kelas: string
  nama_siswa: string
  no_induk: string
  skor_akhir: number | null
  status: string
  tanggal_tes: string | null
  jurusan_rekomendasi: string
}

export default function KepalaSekolahLaporan() {
  const [guruReports, setGuruReports] = useState<GuruReport[]>([])
  const [classReports, setClassReports] = useState<ClassReport[]>([])
  const [studentReports, setStudentReports] = useState<StudentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/kepala-sekolah/laporan")
        const data = await res.json()
        setGuruReports(data.guruReports || [])
        setClassReports(data.classReports || [])
        setStudentReports(data.studentReports || [])
        setUserName(data.userName)
      } catch (error) {
        console.error("Failed to load reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handlePrintReport = (type: 'guru' | 'class', id?: string) => {
    // Simple print functionality
    window.print()
  }

  const handleExportReport = (type: 'guru' | 'class') => {
    const data = type === 'guru' ? guruReports : classReports
    const csvContent = [
      type === 'guru'
        ? ["Nama Guru", "Email", "Total Siswa", "Siswa Selesai Tes", "Rata-rata Skor", "Laporan Terakhir"]
        : ["Kelas", "Total Siswa", "Siswa Selesai Tes", "Rata-rata Skor", "Jurusan Populer"],
      ...data.map(r => type === 'guru'
        ? [r.nama_guru, r.email, r.total_siswa.toString(), r.siswa_selesai_tes.toString(), r.rata_rata_skor.toFixed(2), r.laporan_terakhir]
        : [r.kelas, r.total_siswa.toString(), r.siswa_selesai_tes.toString(), r.rata_rata_skor.toFixed(2), r.jurusan_populer]
      )
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-${type}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredClassReports = selectedClass === 'all'
    ? classReports
    : classReports.filter(r => r.kelas === selectedClass)

  if (loading) {
    return <div className="text-center py-8">Memuat laporan...</div>
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
                <h1 className="text-3xl font-bold text-foreground">Laporan Hasil Tes</h1>
                <p className="text-muted-foreground mt-1">Ringkasan laporan dari guru dan per kelas</p>
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

            {/* Guru Reports */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Laporan Guru</CardTitle>
                <CardDescription>Ringkasan hasil tes yang dikelola oleh masing-masing guru</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Guru</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Siswa</TableHead>
                      <TableHead>Siswa Selesai Tes</TableHead>
                      <TableHead>Rata-rata Skor</TableHead>
                      <TableHead>Laporan Terakhir</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guruReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Belum ada data laporan guru
                        </TableCell>
                      </TableRow>
                    ) : (
                      guruReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.nama_guru}</TableCell>
                          <TableCell>{report.email}</TableCell>
                          <TableCell>{report.total_siswa}</TableCell>
                          <TableCell>{report.siswa_selesai_tes}</TableCell>
                          <TableCell>{report.rata_rata_skor.toFixed(2)}</TableCell>
                          <TableCell>{new Date(report.laporan_terakhir).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintReport('guru', report.id.toString())}
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
                    <CardTitle>Laporan Per Kelas</CardTitle>
                    <CardDescription>Ringkasan hasil tes berdasarkan kelas</CardDescription>
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
                      <TableHead>Siswa Selesai Tes</TableHead>
                      <TableHead>Rata-rata Skor</TableHead>
                      <TableHead>Jurusan Populer</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClassReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Belum ada data laporan kelas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClassReports.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{report.kelas}</TableCell>
                          <TableCell>{report.total_siswa}</TableCell>
                          <TableCell>{report.siswa_selesai_tes}</TableCell>
                          <TableCell>{report.rata_rata_skor.toFixed(2)}</TableCell>
                          <TableCell>{report.jurusan_populer}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintReport('class', report.kelas)}
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

            {/* Student Reports */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Detail Siswa Per Kelas</CardTitle>
                <CardDescription>Daftar nama siswa yang telah mengikuti tes berdasarkan kelas</CardDescription>
              </CardHeader>
              <CardContent>
                {studentReports.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Belum ada data siswa
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Array.from(new Set(studentReports.map(r => r.kelas))).map(kelas => (
                      <div key={kelas} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Kelas {kelas}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No Induk</TableHead>
                              <TableHead>Nama Siswa</TableHead>
                              <TableHead>Status Tes</TableHead>
                              <TableHead>Skor Akhir</TableHead>
                              <TableHead>Tanggal Tes</TableHead>
                              <TableHead>Jurusan Rekomendasi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentReports
                              .filter(r => r.kelas === kelas)
                              .map((student, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{student.no_induk}</TableCell>
                                  <TableCell>{student.nama_siswa}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      student.status === 'selesai'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {student.status === 'selesai' ? 'Selesai' : 'Belum Tes'}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {student.skor_akhir !== null ? student.skor_akhir.toFixed(2) : '-'}
                                  </TableCell>
                                  <TableCell>
                                    {student.tanggal_tes ? new Date(student.tanggal_tes).toLocaleDateString('id-ID') : '-'}
                                  </TableCell>
                                  <TableCell>{student.jurusan_rekomendasi}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
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
