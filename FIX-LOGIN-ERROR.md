# PANDUAN FIX LOGIN ERROR 401 (Unauthorized)

Error 401 berarti password atau email tidak cocok dengan database.

## Penyebab Umum:
1. Password di database tidak di-hash dengan benar
2. User belum ada di database
3. Email yang digunakan tidak sesuai dengan di database

## Solusi (Pilih 1):

### CARA 1: Perbaiki Password Database (RECOMMENDED)

1. **Buka phpMyAdmin**: http://localhost/phpmyadmin
2. **Pilih database**: `sistem_pakar_jurusan`
3. **Klik tab "Import"**
4. **Browse file**: `database/fix-users-password.sql`
5. **Klik "Go"**

✅ Password sudah di-fix. Coba login lagi dengan:
- Email: `siswa001@sman1cibungbulang.sch.id`
- Password: `password123`

---

### CARA 2: Manual Update di phpMyAdmin

1. **Buka phpMyAdmin**: http://localhost/phpmyadmin
2. **Klik database**: `sistem_pakar_jurusan`
3. **Klik table**: `users`
4. **Klik "SQL"** (tab di atas)
5. **Paste query ini**:

\`\`\`sql
UPDATE users SET password = '$2a$10$slYQmyNdGzIqKM0dK5/t.OSst5ZDYvUTRVc1MZn0CKBz5NxxIyxri' WHERE 1=1;
\`\`\`

6. **Klik "Go"**

---

### CARA 3: Cek Data Users

Jika masih error, gunakan query ini untuk debug:

\`\`\`sql
-- Cek berapa user ada
SELECT COUNT(*) as total_users FROM users;

-- Cek detail user
SELECT id, email, nama, role FROM users;

-- Cek specific user
SELECT * FROM users WHERE email = 'siswa001@sman1cibungbulang.sch.id';
\`\`\`

Jika tidak ada hasil, berarti data users belum di-import ke database.
Re-import file `database/seed-users.sql` ke phpMyAdmin.

---

## Akun Test yang Sudah Benar:

\`\`\`
Email: siswa001@sman1cibungbulang.sch.id
Password: password123
Role: siswa

Email: guru001@sman1cibungbulang.sch.id
Password: password123
Role: guru

Email: kepala@sman1cibungbulang.sch.id
Password: password123
Role: kepala_sekolah
\`\`\`

---

## Jika Masih Error:

1. **Cek console browser** (F12 → Console)
   - Lihat error message detail

2. **Cek terminal dev server**
   - Terminal tempat `npm run dev` berjalan
   - Lihat error log dengan "[v0]" prefix

3. **Restart server**:
   \`\`\`bash
   # Stop dev server (Ctrl+C)
   # Jalankan lagi: npm run dev
   \`\`\`

4. **Cek .env.local**:
   - Pastikan `DATABASE_URL` benar
   - Pastikan `JWT_SECRET` sudah set

---

Jika masih tidak bisa, beri tahu error message yang muncul di console!
