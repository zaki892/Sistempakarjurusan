"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Home, MessageCircle, Bell, ClipboardList, History, BookOpen, User } from "lucide-react"

interface StudentSidebarProps {
  userName: string
}

export default function StudentSidebar({ userName }: StudentSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/siswa/notifikasi?unread=true")
        const data = await res.json()
        if (res.ok && data.notifications) {
          setUnreadNotifications(data.notifications.length)
        } else {
          setUnreadNotifications(0)
        }
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error)
        setUnreadNotifications(0)
      }
    }

    fetchUnreadCount()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    { href: "/siswa/dashboard", icon: Home, label: "Dashboard" },
    { href: "/siswa/profil", icon: User, label: "Profil" },
    { href: "/siswa/tes", icon: ClipboardList, label: "Tes Minat Bakat" },
    { href: "/siswa/riwayat", icon: History, label: "Riwayat Tes" },
    { href: "/siswa/jurusan", icon: BookOpen, label: "Informasi Jurusan" },
    
    {
      href: "/siswa/notifikasi",
      icon: Bell,
      label: "Notifikasi",
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-primary-foreground border-0"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 w-64 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">Tes Jurusan </h2>
          <p className="text-sm text-black mt-1">SMAN 1 Cibungbulang</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-sidebar-border bg-sidebar-accent/20">
          <div className="w-12 h-12 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-full flex items-center justify-center text-sidebar-primary-foreground font-bold mb-3">
            {userName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <p className="font-semibold text-sidebar-foreground text-sm">{userName || "Siswa"}</p>
          <p className="text-xs text-black">Siswa</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
