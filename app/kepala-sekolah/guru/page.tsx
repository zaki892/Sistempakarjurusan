"use client"

import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Users } from "lucide-react"

interface Guru {
  id: number
  email: string
  nama: string
  kelas: string
  password: string
}

export default function KepalaSekolahGuruPage() {
  const [gurus, setGurus] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    nama: "",
    kelas: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classes, setClasses] = useState<string[]>([])
  const [classesLoading, setClassesLoading] = useState(false)

  useEffect(() => {
    fetchGurus()
    fetchClasses()
  }, [])

  const fetchGurus = async () => {
    try {
      const res = await fetch("/api/kepala-sekolah/guru")
      const data = await res.json()
      if (res.ok) {
        setGurus(data.gurus)
        setUserName(data.userName)
      } else {
        console.error("Failed to load gurus:", data.message)
      }
    } catch (error) {
      console.error("Error fetching gurus:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    setClassesLoading(true)
    try {
      const res = await fetch("/api/kepala-sekolah/kelas")
      const data = await res.json()
      if (res.ok) {
        setClasses(data.classes)
      } else {
        console.error("Failed to load classes:", data.message)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setClassesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingGuru
        ? `/api/kepala-sekolah/guru/${editingGuru.id}`
        : "/api/kepala-sekolah/guru"
      const method = editingGuru ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert(editingGuru ? "Guru berhasil diperbarui" : "Guru berhasil ditambahkan")
        setFormData({ email: "", nama: "", kelas: "", password: "" })
        setEditingGuru(null)
        setOpenDialog(false)
        fetchGurus()
      } else {
        const data = await res.json()
        alert(data.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (guru: Guru) => {
    setEditingGuru(guru)
    setFormData({
      email: guru.email,
      nama: guru.nama,
      kelas: guru.kelas,
      password: "", // Don't show current password
    })
    setOpenDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus guru ini?")) return

    try {
      const res = await fetch(`/api/kepala-sekolah/guru/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("Guru berhasil dihapus")
        fetchGurus()
      } else {
        const data = await res.json()
        alert(data.message || "Gagal menghapus guru")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan")
    }
  }

  const handleAddNew = () => {
    setEditingGuru(null)
    setFormData({ email: "", nama: "", kelas: "", password: "" })
    setOpenDialog(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <AdminSidebar userName={userName || "Kepala Sekolah"} role="kepala_sekolah" />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Memuat data guru...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminSidebar userName={userName} role="kepala_sekolah" />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Kelola Guru</h1>
                <p className="text-muted-foreground mt-1">
                  Kelola data guru dan tugas kelas | Total guru: {gurus.length}
                </p>
              </div>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Guru
              </Button>
            </div>

            {/* Stats Card */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Guru</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">{gurus.length}</div>
                <Users className="w-8 h-8 text-primary/20" />
              </CardContent>
            </Card>

            {/* Guru Table */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Daftar Guru</CardTitle>
                <CardDescription>Daftar semua guru yang terdaftar dalam sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted/30">
                      <TableHead className="px-6 py-4">Nama</TableHead>
                      <TableHead className="px-6 py-4">Email</TableHead>
                      <TableHead className="px-6 py-4">Password</TableHead>
                      <TableHead className="px-6 py-4">Kelas</TableHead>
                      <TableHead className="px-6 py-4">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gurus.map((guru) => (
                      <TableRow key={guru.id} className="border-b border-border hover:bg-muted/20">
                        <TableCell className="px-6 py-4 font-medium text-foreground">
                          {guru.nama}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground">
                          {guru.email}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground">
                          {guru.password}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {guru.kelas}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(guru)}
                              className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(guru.id)}
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {gurus.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data guru yang terdaftar.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGuru ? "Edit Guru" : "Tambah Guru Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingGuru ? "Perbarui data guru" : "Masukkan data guru baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Masukkan email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelas">Kelas</Label>
              <Select
                value={formData.kelas}
                onValueChange={(value) => setFormData({ ...formData, kelas: value })}
                disabled={classesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((kelas) => (
                    <SelectItem key={kelas} value={kelas}>
                      {kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingGuru && "(kosongkan jika tidak ingin mengubah)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
                required={!editingGuru}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Menyimpan..." : (editingGuru ? "Perbarui" : "Tambah")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
