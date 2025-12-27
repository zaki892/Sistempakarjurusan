export type UserRole = "siswa" | "guru" | "kepala_sekolah"

export interface User {
  id: number
  email: string
  nama: string
  role: UserRole
  no_induk?: string
  kelas?: string
  last_login?: Date
  created_at: Date
}

export interface Jurusan {
  id: number
  nama: string
  deskripsi: string
  kode_jurusan: string
}

export interface Aspek {
  id: number
  nama: string
  deskripsi: string
  bobot: number
}

export interface Soal {
  id: number
  aspek_id: number
  pertanyaan: string
  urutan: number
  options?: PilihanSoal[]
}

export interface PilihanSoal {
  id: number
  soal_id: number
  urutan: number
  teks: string
  nilai: number
}

export interface HasilTes {
  id: number
  siswa_id: number
  tanggal_tes: Date
  skor_akhir?: number
  jurusan_rekomendasi_id?: number
  status: "selesai" | "belum_selesai"
}

export interface Notifikasi {
  id: number
  siswa_id: number
  judul: string
  pesan: string
  tipe: "info" | "warning" | "success"
  dibaca: boolean
  created_at: Date
}
