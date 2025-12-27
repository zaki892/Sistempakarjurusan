"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Plus, Edit, Trash2, Search } from "lucide-react"

interface SiswaData {
  id: number
  nama: string
  email: string
  no_induk: string
  kelas: string
  password: string
}

export default function GuruSiswaPage() {
  const [siswa, setSiswa] = useState<SiswaData[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [guruKelas, setGuruKelas] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nama: "", email: "", no_induk: "", password: "", kelas: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    fetchSiswa()
  }, [])

  useEffect(() => {
    if (openAdd) {
      setFormData(prev => ({ ...prev, kelas: guruKelas }))
    }
  }, [openAdd, guruKelas])

  useEffect(() => {
    if (openEdit) {
      setFormData(prev => ({ ...prev, kelas: guruKelas }))
    }
  }, [openEdit, guruKelas])

  const fetchSiswa = async () => {
    try {
      const res = await fetch("/api/guru/siswa")
      const data = await res.json()
      if (res.ok) {
        setSiswa(data.siswa || [])
        setUserName(data.userName || "")
        setGuruKelas(data.guruKelas || "")
      } else {
        alert(data.message || "Failed to load siswa")
        setSiswa([])
        setUserName("")
        setGuruKelas("")
      }
    } catch (error) {
      console.error("Failed to load siswa:", error)
      alert("Error loading siswa")
      setSiswa([])
      setUserName("")
      setGuruKelas("")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSiswa = async () => {
    if (!formData.nama || !formData.email || !formData.no_induk || !formData.password) {
      alert("Semua field harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Siswa berhasil ditambahkan")
        setFormData({ nama: "", email: "", no_induk: "", password: "", kelas: "" })
        setOpenAdd(false)
        await fetchSiswa()
      } else {
        alert(data.message || "Gagal menambahkan siswa")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menambahkan siswa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSiswa = async () => {
    if (!formData.nama || !formData.email || !formData.no_induk) {
      alert("Semua field harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guru/siswa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...formData }),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Siswa berhasil diperbarui")
        setFormData({ nama: "", email: "", no_induk: "", password: "", kelas: "" })
        setEditingId(null)
        setOpenEdit(false)
        await fetchSiswa()
      } else {
        alert(data.message || "Gagal memperbarui siswa")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error memperbarui siswa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSiswa = async (id: number) => {
    if (!confirm("Yakin hapus siswa ini?")) return

    try {
      const res = await fetch(`/api/guru/siswa?id=${id}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (res.ok) {
        alert("Siswa berhasil dihapus")
        await fetchSiswa()
      } else {
        alert(data.message || "Gagal menghapus siswa")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error menghapus siswa")
    }
  }

  const handleOpenEdit = (s: SiswaData) => {
    setEditingId(s.id)
    setFormData({ nama: s.nama || "", email: s.email || "", no_induk: s.no_induk || "", password: "", kelas: s.kelas || "" })
    setOpenEdit(true)
  }

  const filteredSiswa = siswa.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.no_induk.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <h1 className="text-3xl font-bold text-foreground">Kelola Data Siswa</h1>
                <p className="text-muted-foreground mt-1">Kelas: {guruKelas} | Total siswa: {siswa.length}</p>
              </div>
              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Siswa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Siswa Baru</DialogTitle>
                    <DialogDescription>Anda hanya bisa menambahkan siswa ke kelas yang Anda pegang: {guruKelas}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nama Siswa</label>
                      <Input
                        placeholder="Nama Siswa"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">No Induk</label>
                      <Input
                        placeholder="No Induk"
                        value={formData.no_induk}
                        onChange={(e) => setFormData({ ...formData, no_induk: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kelas</label>
                      <p className="text-sm text-muted-foreground">{guruKelas}</p>
                    </div>
                    <div className="pt-6">
                      <Button
                        onClick={handleAddSiswa}
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
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
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-left font-semibold">No Induk</th>
                        <th className="px-6 py-4 text-left font-semibold">Password</th>
                        <th className="px-6 py-4 text-left font-semibold">Kelas</th>
                        <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSiswa.map((s) => (
                        <tr key={s.id} className="border-b border-border hover:bg-muted/20">
                          <td className="px-6 py-4 text-foreground">{s.nama}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.no_induk}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.password}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.kelas}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(s)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive bg-transparent"
                              onClick={() => handleDeleteSiswa(s.id)}
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

            {filteredSiswa.length === 0 && (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Tidak ada siswa yang sesuai dengan pencarian.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto w-full mx-4">
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
            <DialogDescription>Anda hanya bisa menambahkan siswa ke kelas yang Anda pegang: {guruKelas}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nama Siswa</label>
              <Input
                placeholder="Nama Siswa"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">No Induk</label>
              <Input
                placeholder="No Induk"
                value={formData.no_induk}
                onChange={(e) => setFormData({ ...formData, no_induk: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                placeholder="Password (kosongkan jika tidak diubah)"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Kelas</label>
              <p className="text-sm text-muted-foreground">{guruKelas}</p>
            </div>
            <div className="pt-6">
              <Button
                onClick={handleEditSiswa}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Menyimpan..." : "Perbarui"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
