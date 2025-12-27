-- ===========================================
-- FULL DATABASE SCHEMA FOR SISTEM PAKAR JURUSAN
-- ===========================================
-- This file contains the complete database schema including all tables,
-- constraints, indexes, and initial seed data
-- Run this file to create the entire database from scratch

-- Create database
CREATE DATABASE IF NOT EXISTS `if0_40767076_pakar_`;
USE `if0_40767076_pakar_`;

-- ===========================================
-- TABLE CREATION
-- ===========================================

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `original_password` VARCHAR(255) DEFAULT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `role` ENUM('siswa', 'guru', 'kepala_sekolah') NOT NULL,
  `no_induk` VARCHAR(50),
  `kelas` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL,
  INDEX(`role`),
  INDEX(`email`)
);

-- Jurusan/Majors table
CREATE TABLE IF NOT EXISTS `jurusan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT,
  `kode_jurusan` VARCHAR(50) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Aspek/Criteria table
CREATE TABLE IF NOT EXISTS `aspek` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT,
  `bobot` DECIMAL(5,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Soal test questions table
CREATE TABLE IF NOT EXISTS `soal` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `aspek_id` INT NOT NULL,
  `pertanyaan` TEXT NOT NULL,
  `urutan` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(`aspek_id`) REFERENCES `aspek`(`id`),
  INDEX(`aspek_id`)
);

-- Options untuk soal
CREATE TABLE IF NOT EXISTS `pilihan_soal` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `soal_id` INT NOT NULL,
  `urutan` INT,
  `teks` VARCHAR(255) NOT NULL,
  `nilai` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(`soal_id`) REFERENCES `soal`(`id`) ON DELETE CASCADE,
  INDEX(`soal_id`)
);

-- Relationship antara jurusan dan aspek
CREATE TABLE IF NOT EXISTS `jurusan_aspek` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `jurusan_id` INT NOT NULL,
  `aspek_id` INT NOT NULL,
  `bobot` DECIMAL(5,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(`jurusan_id`) REFERENCES `jurusan`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`aspek_id`) REFERENCES `aspek`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_jurusan_aspek` (`jurusan_id`, `aspek_id`)
);

-- Test results
CREATE TABLE IF NOT EXISTS `hasil_tes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `tanggal_tes` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `skor_akhir` DECIMAL(8,2),
  `jurusan_rekomendasi_id` INT,
  `status` ENUM('selesai', 'belum_selesai') DEFAULT 'belum_selesai',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(`siswa_id`) REFERENCES `users`(`id`),
  FOREIGN KEY(`jurusan_rekomendasi_id`) REFERENCES `jurusan`(`id`),
  INDEX(`siswa_id`),
  INDEX(`status`)
);

-- Test answers
CREATE TABLE IF NOT EXISTS `jawaban_tes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hasil_tes_id` INT NOT NULL,
  `soal_id` INT NOT NULL,
  `pilihan_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(`hasil_tes_id`) REFERENCES `hasil_tes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`soal_id`) REFERENCES `soal`(`id`),
  FOREIGN KEY(`pilihan_id`) REFERENCES `pilihan_soal`(`id`),
  INDEX(`hasil_tes_id`)
);

-- SAW Score details
CREATE TABLE IF NOT EXISTS `skor_saw` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hasil_tes_id` INT NOT NULL,
  `jurusan_id` INT NOT NULL,
  `skor` DECIMAL(8,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(`hasil_tes_id`) REFERENCES `hasil_tes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`jurusan_id`) REFERENCES `jurusan`(`id`),
  INDEX(`hasil_tes_id`)
);

-- Notifications
CREATE TABLE IF NOT EXISTS `notifikasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `pesan` TEXT,
  `tipe` ENUM('info', 'warning', 'success') DEFAULT 'info',
  `dibaca` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(`siswa_id`) REFERENCES `users`(`id`),
  INDEX(`siswa_id`),
  INDEX(`dibaca`)
);

-- Chat history
CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `pertanyaan` TEXT NOT NULL,
  `jawaban` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(`siswa_id`) REFERENCES `users`(`id`),
  INDEX(`siswa_id`)
);

-- ===========================================
-- INSERT USERS (Siswa, Guru, Kepala Sekolah)
-- ===========================================
-- Password default: password123 (di-hash dengan bcrypt)

-- Insert Siswa (if not exists)
INSERT IGNORE INTO `users` (`email`, `password`, `nama`, `role`, `no_induk`, `kelas`) VALUES
('siswa001@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Ahmad Rizki', 'siswa', '12001', '12-A'),
('siswa002@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Bella Kusuma', 'siswa', '12002', '12-A'),
('siswa003@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Citra Dewi', 'siswa', '12003', '12-A'),
('siswa004@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Dedi Santoso', 'siswa', '12004', '12-B'),
('siswa005@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Eka Putri', 'siswa', '12005', '12-B'),
('siswa006@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Fajar Nugroho', 'siswa', '12006', '12-B'),
('siswa007@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Gita Sari', 'siswa', '12007', '12-C'),
('siswa008@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Hendra Wijaya', 'siswa', '12008', '12-C'),
('siswa009@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Indah Permata', 'siswa', '12009', '12-C'),
('siswa010@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Joko Susilo', 'siswa', '12010', '12-C');

-- Update passwords for existing users
UPDATE `users` SET `password` = '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO' WHERE `email` LIKE 'siswa%';
UPDATE `users` SET `password` = '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO' WHERE `email` LIKE 'guru%';
UPDATE `users` SET `password` = '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO' WHERE `email` = 'kepala@sman1cibungbulang.sch.id';

-- Insert Guru (with assigned classes)
INSERT IGNORE INTO `users` (`email`, `password`, `nama`, `role`, `kelas`) VALUES
('guru001@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Ibu Hesti Sulaksana', 'guru', '12-A'),
('guru002@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Pak Budi Santoso', 'guru', '12-B'),
('guru003@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Bu Rina Kartika', 'guru', '12-C');

-- Insert Kepala Sekolah
INSERT IGNORE INTO `users` (`email`, `password`, `nama`, `role`) VALUES
('kepala@sman1cibungbulang.sch.id', '$2b$10$O/fVqD0/TqrD475nH4KqnuWfeTK/z/Gvpg6QQY4vtiaDSO1GG7txSO', 'Dr. Samsi Sutrisna, S.Pd', 'kepala_sekolah');

-- ===========================================
-- INSERT JURUSAN (Majors)
-- ===========================================

INSERT IGNORE INTO `jurusan` (`nama`, `deskripsi`, `kode_jurusan`) VALUES
('Teknik Informatika', 'Program studi yang mempelajari tentang pengembangan perangkat lunak, jaringan komputer, dan teknologi informasi modern', 'TI'),
('Teknik Industri', 'Program studi yang mempelajari tentang optimasi proses produksi, manajemen industri, dan sistem manufaktur', 'TIN'),
('Manajemen', 'Program studi yang mempelajari tentang manajemen bisnis, pemasaran, dan administrasi perusahaan', 'MJ'),
('Desain Grafis', 'Program studi yang mempelajari tentang desain visual, ilustrasi digital, dan komunikasi visual', 'DG'),
('Akuntansi', 'Program studi yang mempelajari tentang pencatatan keuangan, auditing, dan manajemen keuangan', 'AK'),
('Teknik Elektro', 'Program studi yang mempelajari tentang sistem kelistrikan, elektronika, dan teknologi elektro', 'TE'),
('Bahasa Inggris', 'Program studi yang mempelajari tentang linguistik, sastra Inggris, dan komunikasi internasional', 'BI'),
('Teknik Sipil', 'Program studi yang mempelajari tentang konstruksi bangunan, jalan, dan infrastruktur', 'TS');

-- ===========================================
-- INSERT ASPEK (Criteria)
-- ===========================================

INSERT IGNORE INTO `aspek` (`nama`, `deskripsi`, `bobot`) VALUES
('Logika & Analisis', 'Kemampuan berpikir logis, analitis, dan memecahkan masalah', 20.00),
('Kreativitas', 'Kemampuan berpikir kreatif, inovatif, dan menghasilkan ide baru', 15.00),
('Komunikasi', 'Kemampuan berkomunikasi efektif baik lisan maupun tulisan', 15.00),
('Kepemimpinan', 'Kemampuan memimpin, mengorganisir, dan membuat keputusan', 12.00),
('Kerja Tim', 'Kemampuan bekerja sama dalam tim dan berkolaborasi', 12.00),
('Ketekunan', 'Kemampuan bertahan dalam menghadapi tantangan dan bekerja keras', 10.00),
('Adaptabilitas', 'Kemampuan menyesuaikan diri dengan situasi baru', 8.00),
('Keterampilan Teknis', 'Kemampuan menggunakan alat dan teknologi', 8.00);

-- ===========================================
-- INSERT JURUSAN_ASPEK (Relationship between Majors and Criteria)
-- ===========================================

INSERT IGNORE INTO `jurusan_aspek` (`jurusan_id`, `aspek_id`, `bobot`) VALUES
-- Teknik Informatika
(1, 1, 25.00), -- Logika & Analisis
(1, 2, 20.00), -- Kreativitas
(1, 8, 25.00), -- Keterampilan Teknis
(1, 3, 15.00), -- Komunikasi
(1, 5, 15.00), -- Kerja Tim

-- Teknik Industri
(2, 1, 20.00), -- Logika & Analisis
(2, 4, 20.00), -- Kepemimpinan
(2, 6, 20.00), -- Ketekunan
(2, 5, 20.00), -- Kerja Tim
(2, 7, 20.00), -- Adaptabilitas

-- Manajemen
(3, 4, 25.00), -- Kepemimpinan
(3, 3, 25.00), -- Komunikasi
(3, 5, 20.00), -- Kerja Tim
(3, 7, 15.00), -- Adaptabilitas
(3, 1, 15.00), -- Logika & Analisis

-- Desain Grafis
(4, 2, 30.00), -- Kreativitas
(4, 3, 20.00), -- Komunikasi
(4, 8, 20.00), -- Keterampilan Teknis
(4, 7, 15.00), -- Adaptabilitas
(4, 5, 15.00), -- Kerja Tim

-- Akuntansi
(5, 1, 25.00), -- Logika & Analisis
(5, 6, 25.00), -- Ketekunan
(5, 3, 20.00), -- Komunikasi
(5, 7, 15.00), -- Adaptabilitas
(5, 5, 15.00), -- Kerja Tim

-- Teknik Elektro
(6, 1, 20.00), -- Logika & Analisis
(6, 8, 25.00), -- Keterampilan Teknis
(6, 6, 20.00), -- Ketekunan
(6, 5, 20.00), -- Kerja Tim
(6, 7, 15.00), -- Adaptabilitas

-- Bahasa Inggris
(7, 3, 30.00), -- Komunikasi
(7, 2, 20.00), -- Kreativitas
(7, 7, 20.00), -- Adaptabilitas
(7, 5, 15.00), -- Kerja Tim
(7, 4, 15.00), -- Kepemimpinan

-- Teknik Sipil
(8, 1, 20.00), -- Logika & Analisis
(8, 8, 20.00), -- Keterampilan Teknis
(8, 6, 20.00), -- Ketekunan
(8, 5, 20.00), -- Kerja Tim
(8, 4, 15.00); -- Kepemimpinan

-- ===========================================
-- INSERT SOAL (Questions)
-- ===========================================

INSERT IGNORE INTO `soal` (`aspek_id`, `pertanyaan`, `urutan`) VALUES
-- Logika & Analisis
(1, 'Saya senang memecahkan masalah matematika yang kompleks', 1),
(1, 'Saya mudah memahami pola dan hubungan logis', 2),
(1, 'Saya suka menganalisis data dan informasi', 3),
(1, 'Saya dapat berpikir sistematis dalam menyelesaikan masalah', 4),
(1, 'Saya tertarik dengan logika dan pemikiran kritis', 5),

-- Kreativitas
(2, 'Saya sering mendapatkan ide-ide baru yang unik', 1),
(2, 'Saya suka menciptakan sesuatu yang belum pernah ada', 2),
(2, 'Saya dapat berpikir di luar kotak dalam situasi sulit', 3),
(2, 'Saya senang bereksperimen dengan pendekatan baru', 4),
(2, 'Saya memiliki imajinasi yang kuat', 5),

-- Komunikasi
(3, 'Saya nyaman berbicara di depan umum', 1),
(3, 'Saya dapat menjelaskan ide saya dengan jelas', 2),
(3, 'Saya suka berinteraksi dengan orang lain', 3),
(3, 'Saya dapat mendengarkan dan memahami pendapat orang lain', 4),
(3, 'Saya senang menulis dan mengungkapkan pikiran', 5),

-- Kepemimpinan
(4, 'Saya senang memimpin kelompok atau tim', 1),
(4, 'Saya dapat membuat keputusan yang tepat dalam situasi sulit', 2),
(4, 'Saya suka mengorganisir kegiatan', 3),
(4, 'Saya dapat memotivasi orang lain', 4),
(4, 'Saya bertanggung jawab atas tugas yang diberikan', 5),

-- Kerja Tim
(5, 'Saya nyaman bekerja sama dengan orang lain', 1),
(5, 'Saya dapat berkompromi untuk kepentingan kelompok', 2),
(5, 'Saya suka berbagi ide dengan teman', 3),
(5, 'Saya dapat menghargai kontribusi orang lain', 4),
(5, 'Saya suka membantu anggota tim yang kesulitan', 5),

-- Ketekunan
(6, 'Saya dapat bertahan menghadapi tugas yang sulit', 1),
(6, 'Saya tidak mudah menyerah ketika menghadapi kegagalan', 2),
(6, 'Saya dapat bekerja keras untuk mencapai tujuan', 3),
(6, 'Saya disiplin dalam menyelesaikan tugas', 4),
(6, 'Saya dapat mengelola waktu dengan baik', 5),

-- Adaptabilitas
(7, 'Saya mudah menyesuaikan diri dengan situasi baru', 1),
(7, 'Saya dapat belajar hal baru dengan cepat', 2),
(7, 'Saya fleksibel dalam menghadapi perubahan', 3),
(7, 'Saya dapat bekerja dalam berbagai kondisi', 4),
(7, 'Saya terbuka terhadap pendapat dan saran orang lain', 5),

-- Keterampilan Teknis
(8, 'Saya tertarik dengan teknologi dan alat modern', 1),
(8, 'Saya suka mempelajari cara kerja mesin atau peralatan', 2),
(8, 'Saya dapat menggunakan komputer dengan baik', 3),
(8, 'Saya suka memperbaiki atau merakit sesuatu', 4),
(8, 'Saya tertarik dengan bidang teknik dan sains', 5);

-- ===========================================
-- INSERT PILIHAN SOAL (Question Options)
-- ===========================================

INSERT IGNORE INTO `pilihan_soal` (`soal_id`, `urutan`, `teks`, `nilai`) VALUES
-- Soal 1-5 (Logika & Analisis)
(1, 1, 'Sangat Tidak Setuju', 1), (1, 2, 'Tidak Setuju', 2), (1, 3, 'Netral', 3), (1, 4, 'Setuju', 4), (1, 5, 'Sangat Setuju', 5),
(2, 1, 'Sangat Tidak Setuju', 1), (2, 2, 'Tidak Setuju', 2), (2, 3, 'Netral', 3), (2, 4, 'Setuju', 4), (2, 5, 'Sangat Setuju', 5),
(3, 1, 'Sangat Tidak Setuju', 1), (3, 2, 'Tidak Setuju', 2), (3, 3, 'Netral', 3), (3, 4, 'Setuju', 4), (3, 5, 'Sangat Setuju', 5),
(4, 1, 'Sangat Tidak Setuju', 1), (4, 2, 'Tidak Setuju', 2), (4, 3, 'Netral', 3), (4, 4, 'Setuju', 4), (4, 5, 'Sangat Setuju', 5),
(5, 1, 'Sangat Tidak Setuju', 1), (5, 2, 'Tidak Setuju', 2), (5, 3, 'Netral', 3), (5, 4, 'Setuju', 4), (5, 5, 'Sangat Setuju', 5),

-- Soal 6-10 (Kreativitas)
(6, 1, 'Sangat Tidak Setuju', 1), (6, 2, 'Tidak Setuju', 2), (6, 3, 'Netral', 3), (6, 4, 'Setuju', 4), (6, 5, 'Sangat Setuju', 5),
(7, 1, 'Sangat Tidak Setuju', 1), (7, 2, 'Tidak Setuju', 2), (7, 3, 'Netral', 3), (7, 4, 'Setuju', 4), (7, 5, 'Sangat Setuju', 5),
(8, 1, 'Sangat Tidak Setuju', 1), (8, 2, 'Tidak Setuju', 2), (8, 3, 'Netral', 3), (8, 4, 'Setuju', 4), (8, 5, 'Sangat Setuju', 5),
(9, 1, 'Sangat Tidak Setuju', 1), (9, 2, 'Tidak Setuju', 2), (9, 3, 'Netral', 3), (9, 4, 'Setuju', 4), (9, 5, 'Sangat Setuju', 5),
(10, 1, 'Sangat Tidak Setuju', 1), (10, 2, 'Tidak Setuju', 2), (10, 3, 'Netral', 3), (10, 4, 'Setuju', 4), (10, 5, 'Sangat Setuju', 5),

-- Soal 11-15 (Komunikasi)
(11, 1, 'Sangat Tidak Setuju', 1), (11, 2, 'Tidak Setuju', 2), (11, 3, 'Netral', 3), (11, 4, 'Setuju', 4), (11, 5, 'Sangat Setuju', 5),
(12, 1, 'Sangat Tidak Setuju', 1), (12, 2, 'Tidak Setuju', 2), (12, 3, 'Netral', 3), (12, 4, 'Setuju', 4), (12, 5, 'Sangat Setuju', 5),
(13, 1, 'Sangat Tidak Setuju', 1), (13, 2, 'Tidak Setuju', 2), (13, 3, 'Netral', 3), (13, 4, 'Setuju', 4), (13, 5, 'Sangat Setuju', 5),
(14, 1, 'Sangat Tidak Setuju', 1), (14, 2, 'Tidak Setuju', 2), (14, 3, 'Netral', 3), (14, 4, 'Setuju', 4), (14, 5, 'Sangat Setuju', 5),
(15, 1, 'Sangat Tidak Setuju', 1), (15, 2, 'Tidak Setuju', 2), (15, 3, 'Netral', 3), (15, 4, 'Setuju', 4), (15, 5, 'Sangat Setuju', 5),

-- Soal 16-20 (Kepemimpinan)
(16, 1, 'Sangat Tidak Setuju', 1), (16, 2, 'Tidak Setuju', 2), (16, 3, 'Netral', 3), (16, 4, 'Setuju', 4), (16, 5, 'Sangat Setuju', 5),
(17, 1, 'Sangat Tidak Setuju', 1), (17, 2, 'Tidak Setuju', 2), (17, 3, 'Netral', 3), (17, 4, 'Setuju', 4), (17, 5, 'Sangat Setuju', 5),
(18, 1, 'Sangat Tidak Setuju', 1), (18, 2, 'Tidak Setuju', 2), (18, 3, 'Netral', 3), (18, 4, 'Setuju', 4), (18, 5, 'Sangat Setuju', 5),
(19, 1, 'Sangat Tidak Setuju', 1), (19, 2, 'Tidak Setuju', 2), (19, 3, 'Netral', 3), (19, 4, 'Setuju', 4), (19, 5, 'Sangat Setuju', 5),
(20, 1, 'Sangat Tidak Setuju', 1), (20, 2, 'Tidak Setuju', 2), (20, 3, 'Netral', 3), (20, 4, 'Setuju', 4), (20, 5, 'Sangat Setuju', 5),

-- Soal 21-25 (Kerja Tim)
(21, 1, 'Sangat Tidak Setuju', 1), (21, 2, 'Tidak Setuju', 2), (21, 3, 'Netral', 3), (21, 4, 'Setuju', 4), (21, 5, 'Sangat Setuju', 5),
(22, 1, 'Sangat Tidak Setuju', 1), (22, 2, 'Tidak Setuju', 2), (22, 3, 'Netral', 3), (22, 4, 'Setuju', 4), (22, 5, 'Sangat Setuju', 5),
(23, 1, 'Sangat Tidak Setuju', 1), (23, 2, 'Tidak Setuju', 2), (23, 3, 'Netral', 3), (23, 4, 'Setuju', 4), (23, 5, 'Sangat Setuju', 5),
(24, 1, 'Sangat Tidak Setuju', 1), (24, 2, 'Tidak Setuju', 2), (24, 3, 'Netral', 3), (24, 4, 'Setuju', 4), (24, 5, 'Sangat Setuju', 5),
(25, 1, 'Sangat Tidak Setuju', 1), (25, 2, 'Tidak Setuju', 2), (25, 3, 'Netral', 3), (25, 4, 'Setuju', 4), (25, 5, 'Sangat Setuju', 5),

-- Soal 26-30 (Ketekunan)
(26, 1, 'Sangat Tidak Setuju', 1), (26, 2, 'Tidak Setuju', 2), (26, 3, 'Netral', 3), (26, 4, 'Setuju', 4), (26, 5, 'Sangat Setuju', 5),
(27, 1, 'Sangat Tidak Setuju', 1), (27, 2, 'Tidak Setuju', 2), (27, 3, 'Netral', 3), (27, 4, 'Setuju', 4), (27, 5, 'Sangat Setuju', 5),
(28, 1, 'Sangat Tidak Setuju', 1), (28, 2, 'Tidak Setuju', 2), (28, 3, 'Netral', 3), (28, 4, 'Setuju', 4), (28, 5, 'Sangat Setuju', 5),
(29, 1, 'Sangat Tidak Setuju', 1), (29, 2, 'Tidak Setuju', 2), (29, 3, 'Netral', 3), (29, 4, 'Setuju', 4), (29, 5, 'Sangat Setuju', 5),
(30, 1, 'Sangat Tidak Setuju', 1), (30, 2, 'Tidak Setuju', 2), (30, 3, 'Netral', 3), (30, 4, 'Setuju', 4), (30, 5, 'Sangat Setuju', 5),

-- Soal 31-35 (Adaptabilitas)
(31, 1, 'Sangat Tidak Setuju', 1), (31, 2, 'Tidak Setuju', 2), (31, 3, 'Netral', 3), (31, 4, 'Setuju', 4), (31, 5, 'Sangat Setuju', 5),
(32, 1, 'Sangat Tidak Setuju', 1), (32, 2, 'Tidak Setuju', 2), (32, 3, 'Netral', 3), (32, 4, 'Setuju', 4), (32, 5, 'Sangat Setuju', 5),
(33, 1, 'Sangat Tidak Setuju', 1), (33, 2, 'Tidak Setuju', 2), (33, 3, 'Netral', 3), (33, 4, 'Setuju', 4), (33, 5, 'Sangat Setuju', 5),
(34, 1, 'Sangat Tidak Setuju', 1), (34, 2, 'Tidak Setuju', 2), (34, 3, 'Netral', 3), (34, 4, 'Setuju', 4), (34, 5, 'Sangat Setuju', 5),
(35, 1, 'Sangat Tidak Setuju', 1), (35, 2, 'Tidak Setuju', 2), (35, 3, 'Netral', 3), (35, 4, 'Setuju', 4), (35, 5, 'Sangat Setuju', 5),

-- Soal 36-40 (Keterampilan Teknis)
(36, 1, 'Sangat Tidak Setuju', 1), (36, 2, 'Tidak Setuju', 2), (36, 3, 'Netral', 3), (36, 4, 'Setuju', 4), (36, 5, 'Sangat Setuju', 5),
(37, 1, 'Sangat Tidak Setuju', 1), (37, 2, 'Tidak Setuju', 2), (37, 3, 'Netral', 3), (37, 4, 'Setuju', 4), (37, 5, 'Sangat Setuju', 5),
(38, 1, 'Sangat Tidak Setuju', 1), (38, 2, 'Tidak Setuju', 2), (38, 3, 'Netral', 3), (38, 4, 'Setuju', 4), (38, 5, 'Sangat Setuju', 5),
(39, 1, 'Sangat Tidak Setuju', 1), (39, 2, 'Tidak Setuju', 2), (39, 3, 'Netral', 3), (39, 4, 'Setuju', 4), (39, 5, 'Sangat Setuju', 5),
(40, 1, 'Sangat Tidak Setuju', 1), (40, 2, 'Tidak Setuju', 2), (40, 3, 'Netral', 3), (40, 4, 'Setuju', 4), (40, 5, 'Sangat Setuju', 5);

-- ===========================================
-- INSERT SAMPLE NOTIFICATIONS
-- ===========================================

INSERT IGNORE INTO `notifikasi` (`siswa_id`, `judul`, `pesan`, `tipe`) VALUES
(1, 'Selamat Datang!', 'Selamat datang di Sistem Pakar Jurusan SMAN 1 Cibungbulang. Silakan lengkapi tes untuk mendapatkan rekomendasi jurusan.', 'info'),
(2, 'Tes Tersedia', 'Tes penentuan jurusan sudah tersedia. Segera lakukan tes untuk mengetahui jurusan yang sesuai dengan minat dan bakat Anda.', 'info'),
(3, 'Update Sistem', 'Sistem telah diperbarui dengan fitur-fitur terbaru. Cek hasil tes Anda secara berkala.', 'info');

COMMIT;

