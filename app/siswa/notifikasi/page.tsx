"use client"

import { useEffect, useState } from "react"
import StudentSidebar from "@/components/student-sidebar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Check, CheckCheck } from "lucide-react"

interface Notification {
  id: number
  judul: string
  pesan: string
  tipe: "info" | "warning" | "success"
  dibaca: boolean
  created_at: string
}

export default function SiswaNotifikasi() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/siswa/notifikasi")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/siswa/notifikasi/${id}/read`, {
        method: "POST",
      })

      if (response.ok) {
        setNotifications(notifications.map(notif =>
          notif.id === id ? { ...notif, dibaca: true } : notif
        ))
      }
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      const response = await fetch("/api/siswa/notifikasi/mark-all-read", {
        method: "POST",
      })

      if (response.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, dibaca: true })))
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    } finally {
      setMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.dibaca).length

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background md:flex-row">
        <StudentSidebar userName="Siswa" />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
            <div className="text-center py-8">Memuat notifikasi...</div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <StudentSidebar userName="Siswa" />

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-8 h-8" />
                  Notifikasi
                </h1>
                <p className="text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi telah dibaca"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} disabled={markingAll} variant="outline">
                  {markingAll ? "Menandai..." : "Tandai Semua Dibaca"}
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <Card className="border-border">
                <CardContent className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada notifikasi</h3>
                  <p className="text-muted-foreground">Anda belum memiliki notifikasi apapun.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <Card key={notif.id} className={`border-border ${!notif.dibaca ? "bg-muted/30" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {notif.judul}
                            {!notif.dibaca && (
                              <Badge variant="secondary" className="text-xs">
                                Baru
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {new Date(notif.created_at).toLocaleString("id-ID")}
                          </CardDescription>
                        </div>
                        {!notif.dibaca && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notif.id)}
                            className="flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Tandai Dibaca
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground whitespace-pre-wrap">{notif.pesan}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Info */}
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Notifikasi akan muncul secara otomatis ketika ada pembaruan penting dari sistem atau guru pembimbing Anda.
              </AlertDescription>
            </Alert>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
