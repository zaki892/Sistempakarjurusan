"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import StudentHeader from "@/components/student-header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Award, BookOpen, Target } from "lucide-react"

interface UserProfile {
  id: number
  email: string
  nama: string
  no_induk: string
  kelas: string
  role: string
  created_at: string
  last_login?: string
}

interface Stats {
  tests: number
  latestTest: any
}

export default function SiswaProfil() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<Stats>({ tests: 0, latestTest: null })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ nama: "", email: "" })
  const [saving, setSaving] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/siswa/profile")
      const data = await response.json()
      setProfile(data.user)
      setStats(data.stats)
      setFormData({ nama: data.user.nama, email: data.user.email })
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const response = await fetch("/api/siswa/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setProfile({ ...profile, nama: formData.nama, email: formData.email })
        setEditing(false)
        alert("Profil berhasil diperbarui!")
      } else {
        alert("Gagal memperbarui profil")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Terjadi kesalahan saat memperbarui profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName="Siswa" />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Memuat profil...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName="Siswa" />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Profil tidak ditemukan</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName={profile.nama} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <StudentHeader
          userName={profile?.nama || "Siswa"}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          isMenuOpen={isMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-20 md:mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>
                <p className="text-muted-foreground mt-1">Kelola informasi profil Anda</p>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant={editing ? "outline" : "default"}
              >
                {editing ? "Batal" : "Edit Profil"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informasi Pribadi
                    </CardTitle>
                    <CardDescription>Data pribadi Anda sebagai siswa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nama">Nama Lengkap</Label>
                          <Input
                            id="nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            placeholder="Masukkan nama lengkap"
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
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Menyimpan..." : "Simpan"}
                          </Button>
                          <Button variant="outline" onClick={() => setEditing(false)}>
                            Batal
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                            <p className="font-medium">{profile.nama}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nomor Induk</p>
                            <p className="font-medium">{profile.no_induk}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Kelas</p>
                            <p className="font-medium">{profile.kelas}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Bergabung Sejak</p>
                            <p className="font-medium">
                              {new Date(profile.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        {profile.last_login && (
                          <>
                            <Separator />
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Login Terakhir</p>
                                <p className="font-medium">
                                  {new Date(profile.last_login).toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Status Akun</CardTitle>
                    <CardDescription>Informasi status akun Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Role</span>
                      <Badge variant="secondary">{profile.role}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="default">Aktif</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ID Pengguna</span>
                      <span className="text-sm font-mono">{profile.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Statistik Tes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{stats.tests}</div>
                      <p className="text-sm text-muted-foreground">Tes Selesai</p>
                    </div>
                    <Separator />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">
                        {stats.tests > 0 ? "Aktif" : "Belum"}
                      </div>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-muted/30">
                  <CardHeader>
                    <CardTitle>Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert>
                      <AlertDescription className="text-sm">
                        Pastikan data profil Anda selalu terupdate untuk mendapatkan layanan yang optimal.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertDescription className="text-sm">
                        Email yang valid diperlukan untuk menerima notifikasi penting dari sistem.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
