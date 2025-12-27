# Quick Start - Sistem Pakar Jurusan

## Setup Awal (5 Menit)

### 1. Pastikan MySQL Running
- Buka XAMPP Control Panel
- Klik "Start" untuk **Apache** dan **MySQL**

### 2. Buat Database
- Buka http://localhost/phpmyadmin
- Klik **"New"** di kiri
- Nama: `sistem_pakar_jurusan` → Klik **"Create"**

### 3. Import Schema
- Di phpMyAdmin, pilih database `sistem_pakar_jurusan`
- Klik tab **"Import"**
- Browse file: `database/schema.sql`
- Klik **"Go"**

### 4. Reset & Setup Data
- Di phpMyAdmin, klik tab **"SQL"**
- Copy-paste SEMUA isi dari file: `database/reset-and-create-users.sql`
- Klik **"Go"**
- Tunggu sampai selesai (warna hijau = sukses)

### 5. Setup Environment Variables
Buat file `.env.local` di root project dengan isi:
\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistem_pakar_jurusan
JWT_SECRET=your-secret-key-12345
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 6. Install & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

Server berjalan di: http://localhost:3000

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Siswa | siswa001@test.com | password123 |
| Guru | guru001@test.com | password123 |
| Kepala Sekolah | kepala@test.com | password123 |

---

## Debug

Jika masih error 401, jalankan:
\`\`\`bash
node scripts/debug-login.js
\`\`\`

Script ini akan:
- Cek koneksi database
- Lihat semua user di database
- Test password hash matching

---

## Struktur File

\`\`\`
project/
├── database/
│   ├── schema.sql                    (Buat tabel)
│   └── reset-and-create-users.sql    (Setup data awal)
├── scripts/
│   └── debug-login.js                (Debug tool)
├── .env.local                         (Env variables)
└── app/
    └── api/auth/login/route.ts       (Login endpoint)
