import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/SMA.jpg"
              alt="SMA Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="font-bold text-lg text-foreground">SMAN 1 Cibungbulang</h1>
          </div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Masuk</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Sistem Pakar Penentuan Jurusan</h2>
            <p className="text-xl text-muted-foreground mb-8">
              SMAN 1 Cibungbulang menggunakan metode SAW (Simple Additive Weighting) untuk membantu siswa menemukan
              jurusan yang sesuai dengan minat dan bakat mereka.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Mulai Tes Sekarang
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">Fitur Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card className="border-border">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl">🎯</span>
                  </div>
                  <CardTitle>Tes Minat Bakat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tes komprehensif untuk mengidentifikasi minat dan bakat Anda secara akurat.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-border">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl">📊</span>
                  </div>
                  <CardTitle>Rekomendasi Jurusan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Dapatkan rekomendasi jurusan yang paling sesuai berdasarkan hasil tes SAW.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-border">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl">💬</span>
                  </div>
                  <CardTitle>Konsultasi Chatbot</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tanyakan pertanyaan tentang jurusan dan dapatkan jawaban dari AI chatbot kami.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">Cara Kerja Sistem</h3>
            <div className="space-y-6">
              {[
                { step: 1, title: "Login", desc: "Masuk dengan akun yang telah dibuat oleh guru" },
                { step: 2, title: "Isi Tes", desc: "Jawab pertanyaan tes minat dan bakat dengan jujur" },
                { step: 3, title: "Analisis SAW", desc: "Sistem menganalisis jawaban menggunakan metode SAW" },
                { step: 4, title: "Dapatkan Hasil", desc: "Lihat rekomendasi jurusan dan detailnya" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">Informasi untuk Setiap Pengguna</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Siswa */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-primary">Siswa</CardTitle>
                  <CardDescription>Pengguna Utama</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Lakukan tes minat bakat</li>
                    <li>✓ Lihat hasil dan rekomendasi</li>
                    <li>✓ Lihat detail jurusan</li>
                    <li>✓ Cetak hasil tes</li>
                    <li>✓ Konsultasi dengan chatbot</li>
                    <li>✓ Lihat riwayat tes</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Guru */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-secondary">Guru/Admin</CardTitle>
                  <CardDescription>Administrator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Kelola data siswa</li>
                    <li>✓ Kelola soal tes</li>
                    <li>✓ Kelola jurusan & bobot</li>
                    <li>✓ Lihat hasil tes siswa</li>
                    <li>✓ Cetak laporan rekapitulasi</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Kepala Sekolah */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-accent">Kepala Sekolah</CardTitle>
                  <CardDescription>Pimpinan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Melihat statistik hasil tes</li>
                    <li>✓ Analisis data komprehensif</li>
                    <li>✓ Cetak laporan per kelas</li>
                    <li>✓ Monitor perkembangan siswa</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
