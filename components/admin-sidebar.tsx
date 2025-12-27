"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard, Users, FileText, BookOpen, BarChart3 } from "lucide-react"

export default function AdminSidebar({ userName, role }: { userName: string; role: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems =
    role === "guru"
      ? [
          { href: "/guru/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/guru/siswa", icon: Users, label: "Kelola Siswa" },
          { href: "/guru/soal", icon: FileText, label: "Kelola Soal" },
          { href: "/guru/jurusan", icon: BookOpen, label: "Kelola Jurusan" },
          { href: "/guru/hasil", icon: BarChart3, label: "Lihat Hasil" },
          { href: "/guru/laporan", icon: FileText, label: "Laporan" },
        ]
      : [
          { href: "/kepala-sekolah/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/kepala-sekolah/guru", icon: Users, label: "Kelola Guru" },
          //{ href: "/kepala-sekolah/statistik", icon: BarChart3, label: "Statistik" },
          { href: "/kepala-sekolah/laporan", icon: FileText, label: "Laporan" },
        ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
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
          <h2 className="text-lg font-bold text-sidebar-foreground">Admin System</h2>
          <p className="text-xs text-black mt-1">SMAN 1 Cibungbulang</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="w-12 h-12 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground font-bold mb-3">
            {userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          <p className="font-semibold text-sidebar-foreground text-sm">{userName || "Loading..."}</p>
          <p className="text-xs text-black">{role === "guru" ? "Guru/Admin" : "Kepala Sekolah"}</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
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
