"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface JurusanData {
  id: number
  nama: string
  deskripsi: string
  kode_jurusan: string
}

export default function GuruJurusanPage() {
  const [jurusan, setJurusan] = useState<JurusanData[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nama: "", deskripsi: "", kode_jurusan: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchJurusan()
  }, [])

  const fetchJurusan = async () => {
    try {
      const res = await fetch("/api/guru/jurusan")
      const data = await res.json()
      if (res.ok) {
        setJurusan(data.jurusan || [])
        setUserName(data.userName || "")
      } else {
        console.error("Failed to load jurusan:", data.message)
        setJurusan([])
        setUserName("")
      }
    } catch (error) {
      console.error("Failed to load jurusan:", error)
      setJurusan([])
      setUserName("")
    } finally {
      setLoading(false)
    }
  }

  const handleAddJurusan = async () => {
    if (!formData.nama) {
      alert("Nama jurusan harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/jurusan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert("Jurusan berhasil ditambahkan")
        setFormData({ nama: "", deskripsi: "", kode_jurusan: "" })
        setOpenAdd(false)
        await fetchJurusan()
      } else {
        alert("Gagal menambahkan jurusan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menambahkan jurusan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditJurusan = async () => {
    if (!formData.nama) {
      alert("Nama jurusan harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/jurusan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...formData }),
      })

      if (res.ok) {
        alert("Jurusan berhasil diperbarui")
        setFormData({ nama: "", deskripsi: "", kode_jurusan: "" })
        setEditingId(null)
        setOpenEdit(false)
        await fetchJurusan()
      } else {
        alert("Gagal memperbarui jurusan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error memperbarui jurusan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteJurusan = async (id: number) => {
    if (!confirm("Yakin hapus jurusan ini?")) return

    try {
      const res = await fetch(`/api/guru/jurusan?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Jurusan berhasil dihapus")
        await fetchJurusan()
      } else {
        alert("Gagal menghapus jurusan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menghapus jurusan")
    }
  }

  const handleOpenEdit = (j: JurusanData) => {
    setEditingId(j.id)
    setFormData({ nama: j.nama || "", deskripsi: j.deskripsi || "", kode_jurusan: j.kode_jurusan || "" })
    setOpenEdit(true)
  }

  const filteredJurusan = jurusan.filter(
    (j) =>
      j.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <h1 className="text-3xl font-bold text-foreground">Kelola Data Jurusan</h1>
                <p className="text-muted-foreground mt-1">Total jurusan: {jurusan.length}</p>
              </div>
              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Jurusan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Jurusan Baru</DialogTitle>
                    <DialogDescription>Isi form di bawah untuk menambah jurusan baru</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nama Jurusan"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    />
                    <Textarea
                      placeholder="Deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      rows={3}
                    />
                    <Input
                      placeholder="Kode Jurusan"
                      value={formData.kode_jurusan}
                      onChange={(e) => setFormData({ ...formData, kode_jurusan: e.target.value })}
                    />
                    <Button
                      onClick={handleAddJurusan}
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
                placeholder="Cari jurusan..."
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
                        <th className="px-6 py-4 text-left font-semibold">Nama</th>
                        <th className="px-6 py-4 text-left font-semibold">Deskripsi</th>
                        <th className="px-6 py-4 text-left font-semibold">Kode Jurusan</th>
                        <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJurusan.map((j) => (
                        <tr key={j.id} className="border-b border-border hover:bg-muted/20">
                          <td className="px-6 py-4 text-foreground">{j.nama}</td>
                          <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{j.deskripsi}</td>
                          <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{j.kode_jurusan}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(j)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive bg-transparent"
                              onClick={() => handleDeleteJurusan(j.id)}
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

            {filteredJurusan.length === 0 && (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Tidak ada jurusan yang sesuai dengan pencarian.</p>
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
            <DialogTitle>Edit Jurusan</DialogTitle>
            <DialogDescription>Perbarui data jurusan di bawah</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nama Jurusan"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
            <Textarea
              placeholder="Deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={3}
            />
            <Input
              placeholder="Kode Jurusan"
              value={formData.kode_jurusan}
              onChange={(e) => setFormData({ ...formData, kode_jurusan: e.target.value })}
            />
            <Button
              onClick={handleEditJurusan}
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
