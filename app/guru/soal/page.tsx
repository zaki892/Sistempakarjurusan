"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface Aspek {
  id: number
  nama: string
}

interface SoalData {
  id: number
  pertanyaan: string
  aspek_id: number
  aspek_nama: string
}

export default function GuruSoalPage() {
  const [soal, setSoal] = useState<SoalData[]>([])
  const [aspek, setAspek] = useState<Aspek[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ pertanyaan: "", aspek_id: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
  try {
    const [soalRes, aspekRes] = await Promise.all([
      fetch("/api/guru/soal"),
      fetch("/api/guru/aspek")
    ])

    const soalData = await soalRes.json()
    const aspekData = await aspekRes.json()

    // Gunakan fallback jika data tidak ada
    setSoal(soalData?.soal || [])
    setAspek(aspekData?.aspek || [])
    setUserName(soalData?.userName || "")
  } catch (error) {
    console.error("Failed to load data:", error)
    // Tambahkan fallback juga di catch
    setSoal([])
    setAspek([])
  } finally {
    setLoading(false)
  }
}


  const handleAddSoal = async () => {
    if (!formData.pertanyaan || !formData.aspek_id) {
      alert("Semua field harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pertanyaan: formData.pertanyaan, aspek_id: Number(formData.aspek_id) }),
      })

      if (res.ok) {
        alert("Soal berhasil ditambahkan")
        setFormData({ pertanyaan: "", aspek_id: "" })
        setOpenAdd(false)
        await fetchData()
      } else {
        alert("Gagal menambahkan soal")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menambahkan soal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSoal = async () => {
    if (!formData.pertanyaan || !formData.aspek_id) {
      alert("Semua field harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/soal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          pertanyaan: formData.pertanyaan,
          aspek_id: Number(formData.aspek_id),
        }),
      })

      if (res.ok) {
        alert("Soal berhasil diperbarui")
        setFormData({ pertanyaan: "", aspek_id: "" })
        setEditingId(null)
        setOpenEdit(false)
        await fetchData()
      } else {
        alert("Gagal memperbarui soal")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error memperbarui soal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSoal = async (id: number) => {
    if (!confirm("Yakin hapus soal ini?")) return

    try {
      const res = await fetch(`/api/guru/soal?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Soal berhasil dihapus")
        await fetchData()
      } else {
        alert("Gagal menghapus soal")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menghapus soal")
    }
  }

  const handleOpenEdit = (s: SoalData) => {
    setEditingId(s.id)
    setFormData({ pertanyaan: s.pertanyaan, aspek_id: String(s.aspek_id) })
    setOpenEdit(true)
  }
const filteredSoal = (soal || []).filter(
  (s) => s.pertanyaan?.toLowerCase().includes(searchTerm.toLowerCase())
)


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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Kelola Soal Tes</h1>
                <p className="text-muted-foreground mt-1">Total soal: {soal.length}</p>
              </div>
              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Soal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Soal Baru</DialogTitle>
                    <DialogDescription>Isi form di bawah untuk menambah soal baru</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Pertanyaan"
                      value={formData.pertanyaan}
                      onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
                    />
                    <Select
                      value={formData.aspek_id}
                      onValueChange={(value) => setFormData({ ...formData, aspek_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Aspek" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspek.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddSoal}
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari soal..."
                className="pl-10 bg-input border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <Card className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-4 text-left font-semibold">Pertanyaan</th>
                        <th className="px-6 py-4 text-left font-semibold">Aspek</th>
                        <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSoal.map((s) => (
                        <tr key={s.id} className="border-b border-border hover:bg-muted/20">
                          <td className="px-6 py-4 text-foreground">{s.pertanyaan}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.aspek_nama}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(s)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive bg-transparent"
                              onClick={() => handleDeleteSoal(s.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {filteredSoal.length === 0 && (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Tidak ada soal yang sesuai dengan pencarian.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Soal</DialogTitle>
            <DialogDescription>Perbarui soal di bawah</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Pertanyaan"
              value={formData.pertanyaan}
              onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
            />
            <Select value={formData.aspek_id} onValueChange={(value) => setFormData({ ...formData, aspek_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Aspek" />
              </SelectTrigger>
              <SelectContent>
                {aspek.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleEditSoal}
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
