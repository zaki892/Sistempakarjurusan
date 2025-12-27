"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Calendar, Target, Search, Filter } from "lucide-react"
import Link from "next/link"

interface HasilTes {
  id: number
  tanggal_tes: string
  skor_akhir: number
  status: string
  jurusan_rekomendasi: {
    nama: string
    deskripsi: string
  }
  siswa: {
    nama: string
    no_induk: string
    kelas: string
  }
}

export default function GuruHasilPage() {
  const [hasil, setHasil] = useState<HasilTes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [guruKelas, setGuruKelas] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchHasil()
  }, [])

  const fetchHasil = async () => {
    try {
      const res = await fetch("/api/guru/hasil")
      const data = await res.json()
      if (res.ok) {
        setHasil(data.hasil || [])
        setUserName(data.userName || "")
        setGuruKelas(data.guruKelas || "")
      } else {
        setError(data.message || "Failed to load hasil tes")
        setHasil([])
        setUserName("")
        setGuruKelas("")
      }
    } catch (err) {
      console.error("Error fetching hasil:", err)
      setError("Gagal memuat hasil tes")
      setHasil([])
      setUserName("")
      setGuruKelas("")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return <Badge variant="default" className="bg-green-500">Selesai</Badge>
      case "proses":
        return <Badge variant="secondary">Proses</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredHasil = hasil.filter((h) => {
    const matchesSearch =
      h.siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.siswa.no_induk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.jurusan_rekomendasi.nama.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || h.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <AdminSidebar userName={userName || "Guru"} role="guru" />
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
        <AdminSidebar userName={userName || "Guru"} role="guru" />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <Alert className="max-w-2xl mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminSidebar userName={userName} role="guru" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Hasil Tes Siswa Kelas {guruKelas}</h1>
                <p className="text-muted-foreground mt-1">
                  Total hasil: {hasil.length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama siswa, no induk, atau jurusan..."
                  className="pl-10 bg-input border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="proses">Proses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Table */}
            <Card className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/30">
                        <TableHead className="px-6 py-4">Siswa</TableHead>
                        <TableHead className="px-6 py-4">Jurusan Rekomendasi</TableHead>
                        <TableHead className="px-6 py-4">Skor</TableHead>
                        <TableHead className="px-6 py-4">Status</TableHead>
                        <TableHead className="px-6 py-4">Tanggal</TableHead>
                        <TableHead className="px-6 py-4">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHasil.map((h) => (
                        <TableRow key={h.id} className="border-b border-border hover:bg-muted/20">
                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{h.siswa.nama}</p>
                              <p className="text-sm text-muted-foreground">{h.siswa.no_induk}</p>
                              <p className="text-sm text-muted-foreground">{h.siswa.kelas}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{h.jurusan_rekomendasi.nama}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {h.jurusan_rekomendasi.deskripsi}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge variant="outline" className="font-mono">
                              {h.skor_akhir.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">{getStatusBadge(h.status)}</TableCell>
                          <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(h.tanggal_tes).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Link href={`/guru/hasil/${h.id}`}>
                              <Button variant="outline" size="sm">
                                Lihat Detail
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {filteredHasil.length === 0 && (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {hasil.length === 0
                      ? "Belum ada hasil tes siswa di kelas ini."
                      : "Tidak ada hasil tes yang sesuai dengan filter."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Summary Stats */}
            {hasil.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Tes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hasil.length}</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tes Selesai</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {hasil.filter((h) => h.status === "selesai").length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {hasil.length > 0
                        ? (hasil.reduce((sum, h) => sum + h.skor_akhir, 0) / hasil.length).toFixed(2)
                        : "0.00"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
