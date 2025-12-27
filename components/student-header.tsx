"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StudentHeaderProps {
  userName: string
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

interface Notification {
  id: number
  judul: string
  pesan: string
  tipe: "info" | "warning" | "success"
  dibaca: boolean
}

export default function StudentHeader({ userName, onMenuToggle, isMenuOpen }: StudentHeaderProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/siswa/notifikasi?unread=true")
        const data = await res.json()
        if (res.ok && data.notifications) {
          setUnreadNotifications(data.notifications.length)
          setRecentNotifications(data.notifications.slice(0, 5)) // Show top 5
        } else {
          setUnreadNotifications(0)
          setRecentNotifications([])
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        setUnreadNotifications(0)
        setRecentNotifications([])
      }
    }

    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left side - Mobile menu toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Logo/Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground">Tes Jurusan</h1>
            <p className="text-xs text-muted-foreground">SMAN 1 Cibungbulang</p>
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifikasi</h3>
                <p className="text-sm text-muted-foreground">
                  {unreadNotifications > 0 ? `${unreadNotifications} belum dibaca` : "Semua telah dibaca"}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{notif.judul}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.pesan}</p>
                        {!notif.dibaca && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Baru
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">Tidak ada notifikasi baru</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t">
                <Link href="/siswa/notifikasi">
                  <Button variant="ghost" size="sm" className="w-full">
                    Lihat Semua Notifikasi
                  </Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Info */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              {userName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName || "Siswa"}</p>
              <p className="text-xs text-muted-foreground">Siswa</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
