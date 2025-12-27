export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* School Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">SMAN 1 Cibungbulang</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Sistem Pakar Penentuan Jurusan Kuliah menggunakan metode SAW
            </p>
            <p className="text-sm text-muted-foreground">
              NPSN: 20212345 | Akreditasi: A
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition">
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Fitur</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Tes Minat Bakat</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Rekomendasi Jurusan</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Statistik Hasil</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Konsultasi Chatbot</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Laporan & Analisis</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Kontak</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📍 Jl. Raya Cibungbulang No. 123</p>
              <p>   Kecamatan Cibungbulang, Kabupaten Bogor</p>
              <p>   Jawa Barat 16630</p>
              <p>📞 (021) 1234-5678</p>
              <p>📧 info@sman1cibungbulang.sch.id</p>
              <p>🌐 www.sman1cibungbulang.sch.id</p>
            </div>
          </div>
        </div>

        {/* Social Media & Additional Info */}
        <div className="border-t border-border pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Media Sosial</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  📘 Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  📷 Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  🐦 Twitter
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Jam Operasional</h4>
              <p className="text-sm text-muted-foreground">
                Senin - Jumat: 07:00 - 15:00 WIB<br />
                Sabtu: 07:00 - 12:00 WIB
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 SMAN 1 Cibungbulang. Semua hak dilindungi.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                Syarat Penggunaan
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                Peta Situs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
