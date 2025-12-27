"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BarChart3, Users, FileText, BookOpen, Download, Edit, Trash2 } from "lucide-react"

interface LaporanStats {
  totalSiswa: number
  totalSoal: number
  totalJurusan: number
  totalHasil: number
}

interface TestResult {
  id: number
  tanggal_tes: string
  skor_akhir: number
  status: string
  jurusan_rekomendasi_id: number
  siswa: {
    nama: string
    no_induk: string
    kelas: string
  }
  jurusan_rekomendasi: string
}

interface JurusanData {
  id: number
  nama: string
}

export default function GuruLaporan() {
  const [stats, setStats] = useState<LaporanStats>({
    totalSiswa: 0,
    totalSoal: 0,
    totalJurusan: 0,
    totalHasil: 0,
  })
  const [results, setResults] = useState<TestResult[]>([])
  const [jurusan, setJurusan] = useState<JurusanData[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ jurusan_rekomendasi_id: "", skor_akhir: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await fetch("/api/guru/laporan")
        const data = await res.json()
        setStats(data.stats)
        setResults(data.results)
        setJurusan(data.jurusan || [])
        setUserName(data.userName)
      } catch (error) {
        console.error("Failed to load laporan:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaporan()
  }, [])

  const handleEditResult = async () => {
    if (!editingId) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/laporan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          jurusan_rekomendasi_id: parseInt(formData.jurusan_rekomendasi_id),
          skor_akhir: parseFloat(formData.skor_akhir),
        }),
      })

      if (res.ok) {
        alert("Hasil tes berhasil diperbarui")
        setFormData({ jurusan_rekomendasi_id: "", skor_akhir: "" })
        setEditingId(null)
        setOpenEdit(false)
        // Refresh data
        const fetchRes = await fetch("/api/guru/laporan")
        const data = await fetchRes.json()
        setResults(data.results)
      } else {
        alert("Gagal memperbarui hasil tes")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error memperbarui hasil tes")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResult = async (id: number) => {
    if (!confirm("Yakin hapus hasil tes ini?")) return

    try {
      const res = await fetch(`/api/guru/laporan?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Hasil tes berhasil dihapus")
        // Refresh data
        const fetchRes = await fetch("/api/guru/laporan")
        const data = await fetchRes.json()
        setResults(data.results)
      } else {
        alert("Gagal menghapus hasil tes")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menghapus hasil tes")
    }
  }

  const handleOpenEdit = (result: TestResult) => {
    setEditingId(result.id)
    setFormData({
      jurusan_rekomendasi_id: result.jurusan_rekomendasi_id.toString(),
      skor_akhir: result.skor_akhir.toString(),
    })
    setOpenEdit(true)
  }

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ["Tanggal Tes", "Nama Siswa", "No Induk", "Kelas", "Jurusan Rekomendasi", "Skor Akhir"],
      ...results.map(r => [
        new Date(r.tanggal_tes).toLocaleDateString('id-ID'),
        r.siswa.nama,
        r.siswa.no_induk,
        r.siswa.kelas,
        r.jurusan_rekomendasi,
        r.skor_akhir.toString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'laporan-hasil-tes.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="text-center py-8">Memuat laporan...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminSidebar userName={userName} role="guru" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Laporan Hasil Tes</h1>
                <p className="text-muted-foreground mt-1">Ringkasan statistik dan daftar hasil tes siswa</p>
              </div>
              <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Kelas Info */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Kelas:</strong> {stats.kelas || 'N/A'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Soal</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-secondary">{stats.totalSoal}</div>
                  <FileText className="w-8 h-8 text-secondary/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Jurusan</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-accent">{stats.totalJurusan}</div>
                  <BookOpen className="w-8 h-8 text-accent/20" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hasil Tes</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">{stats.totalHasil}</div>
                  <BarChart3 className="w-8 h-8 text-green-600/20" />
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Daftar Hasil Tes Siswa</CardTitle>
                <CardDescription>Daftar lengkap hasil tes yang telah selesai</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal Tes</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>No Induk</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jurusan Rekomendasi</TableHead>
                      <TableHead>Skor Akhir</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Belum ada hasil tes yang tersedia
                        </TableCell>
                      </TableRow>
                    ) : (
                      results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            {new Date(result.tanggal_tes).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>{result.siswa.nama}</TableCell>
                          <TableCell>{result.siswa.no_induk}</TableCell>
                          <TableCell>{result.siswa.kelas}</TableCell>
                          <TableCell>{result.jurusan_rekomendasi}</TableCell>
                          <TableCell className="font-medium">{result.skor_akhir.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEdit(result)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteResult(result.id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
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

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hasil Tes</DialogTitle>
            <DialogDescription>Perbarui data hasil tes di bawah</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={formData.jurusan_rekomendasi_id}
              onValueChange={(value) => setFormData({ ...formData, jurusan_rekomendasi_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jurusan Rekomendasi" />
              </SelectTrigger>
              <SelectContent>
                {jurusan.map((j) => (
                  <SelectItem key={j.id} value={j.id.toString()}>
                    {j.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              placeholder="Skor Akhir"
              value={formData.skor_akhir}
              onChange={(e) => setFormData({ ...formData, skor_akhir: e.target.value })}
            />
            <Button
              onClick={handleEditResult}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Menyimpan..." : "Perbarui"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
