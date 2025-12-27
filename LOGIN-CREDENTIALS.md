# Akun Login Test

Setelah menjalankan `simple-reset.sql`, gunakan akun berikut:

## Siswa
- Email: `siswa001@test.com`
- Password: `password123`

## Guru/Admin
- Email: `guru001@test.com`
- Password: `password123`

## Kepala Sekolah
- Email: `kepala@test.com`
- Password: `password123`

---

## Petunjuk Reset Database

1. Buka **phpMyAdmin**: http://localhost/phpmyadmin
2. Pilih database `sistem_pakar_jurusan`
3. Klik tab **"SQL"**
4. Copy-paste seluruh isi `database/simple-reset.sql`
5. Klik tombol **"Go"**
6. Tunggu sampai selesai (hijau)

Kemudian coba login dengan email dan password di atas.

---

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Pastikan MySQL sudah running (XAMPP klik Start)
- Cek `.env.local` di root project - pastikan DB_PASSWORD kosong (atau sesuai config MySQL Anda)

### Error: "Unknown database 'sistem_pakar_jurusan'"
- Buat database dulu: Di phpMyAdmin, klik "New" → ketik `sistem_pakar_jurusan`
- Atau jalankan `database/schema.sql` terlebih dahulu

### Masih error 401
- Pastikan email di form sama dengan yang ada di database
- Cek di phpMyAdmin: `SELECT * FROM users;`
- Jika email berbeda, update form atau update database
