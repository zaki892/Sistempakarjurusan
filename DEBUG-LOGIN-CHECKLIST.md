# Checklist Troubleshooting Login Error 401

## Langkah 1: Verifikasi MySQL Running
\`\`\`bash
# Pastikan MySQL sudah running
# Di XAMPP Control Panel, klik "Start" pada MySQL
# Atau cek di terminal:
mysql -u root
# Jika berhasil connect, ketik: exit
\`\`\`

Jika MySQL tidak running:
- Buka XAMPP
- Klik tombol "Start" di MySQL row
- Tunggu status menjadi "Running"

---

## Langkah 2: Run Debug Script
\`\`\`bash
# Run comprehensive debug
node scripts/debug-complete.js
\`\`\`

### Interpretasi Output:

**Jika bcrypt test GAGAL:**
\`\`\`
Password "password123" matches hash: ✗ NO
ERROR: Password hash mismatch!
\`\`\`
→ Jalankan: `node scripts/reset-password.js`

**Jika database connection GAGAL:**
\`\`\`
✗ Database connection error: connect ECONNREFUSED
\`\`\`
→ MySQL tidak running atau setting wrong

**Jika user NOT found:**
\`\`\`
✗ User NOT found with email: siswa001@test.com
\`\`\`
→ Lihat email yang tersedia di output

---

## Langkah 3: Reset Password (jika hash corrupt)
\`\`\`bash
node scripts/reset-password.js
\`\`\`

Expected output:
\`\`\`
✓ Updated 11 users
\`\`\`

---

## Langkah 4: Verifikasi di phpMyAdmin
Buka: http://localhost/phpmyadmin

1. Database: `sistem_pakar_jurusan`
2. Table: `users`
3. Cari email: `siswa001@test.com`
4. Pastikan password hash dimulai dengan: `$2a$10$`

---

## Langkah 5: Restart Dev Server
\`\`\`bash
# Di terminal, tekan Ctrl+C
npm run dev
\`\`\`

---

## Langkah 6: Coba Login
- Email: `siswa001@test.com`
- Password: `password123`

---

## Jika Masih Error 401

Cek terminal console untuk debug logs:
- Lihat apakah user ditemukan
- Lihat apakah password match
- Copy-paste error message lengkap

Beri tahu saya output dari:
1. `node scripts/debug-complete.js`
2. Error di browser console (F12)
3. Error di terminal npm run dev
