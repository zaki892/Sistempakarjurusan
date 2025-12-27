import { query } from "./db"

interface AspekScore {
  aspekId: number
  aspekNama: string
  totalNilai: number
  bobot: number
}

interface JurusanScore {
  jurusanId: number
  jurusanNama: string
  sawScore: number
  bobotAspek: Record<number, number>
}

export async function calculateSAWScore(
  jawaban: Record<number, number>, // soalId -> pilihanId
  siswaId: number,
): Promise<{ bestMajor: any; allScores: JurusanScore[]; hasilTesId: number }> {
  try {
    // Get all soal and their pilihan
    const soalResults = (await query(
      `SELECT s.id, s.aspek_id, ps.id as pilihan_id, ps.nilai
       FROM soal s
       LEFT JOIN pilihan_soal ps ON s.id = ps.soal_id
       WHERE ps.id IN (${Object.values(jawaban).join(",")})`,
    )) as any[]

    // Calculate score per aspect (Aspek)
    const aspekScores: Record<number, { total: number; count: number }> = {}
    const soalAspek: Record<number, number> = {}

    for (const soal of soalResults) {
      soalAspek[soal.id] = soal.aspek_id
      if (!aspekScores[soal.aspek_id]) {
        aspekScores[soal.aspek_id] = { total: 0, count: 0 }
      }

      // Find answer for this soal
      const selectedOption = soalResults.find((s: any) => s.id === soal.id && jawaban[soal.id] === s.pilihan_id)

      if (selectedOption) {
        aspekScores[soal.aspek_id].total += selectedOption.nilai
        aspekScores[soal.aspek_id].count += 1
      }
    }

    // Normalize aspek scores (0-100)
    const normalizedAspekScores: Record<number, number> = {}
    for (const [aspekId, score] of Object.entries(aspekScores)) {
      const typedScore = score as { total: number; count: number }
      normalizedAspekScores[aspekId] = (typedScore.total / (typedScore.count * 5)) * 100 // Assuming max nilai = 5
    }

    // Get all jurusan and their aspek bobot
    const jurusanResults = (await query(`SELECT DISTINCT j.id, j.nama FROM jurusan j`)) as any[]

    const allJurusanScores: JurusanScore[] = []

    for (const jurusan of jurusanResults) {
      // Get bobot for this jurusan
      const bobotResults = (await query(`SELECT aspek_id, bobot FROM jurusan_aspek WHERE jurusan_id = ?`, [
        jurusan.id,
      ])) as any[]

      let sawScore = 0
      const bobotAspek: Record<number, number> = {}

      for (const bobot of bobotResults) {
        bobotAspek[bobot.aspek_id] = bobot.bobot
        const aspekScore = normalizedAspekScores[bobot.aspek_id] || 0
        sawScore += aspekScore * (bobot.bobot / 100)
      }

      allJurusanScores.push({
        jurusanId: jurusan.id,
        jurusanNama: jurusan.nama,
        sawScore,
        bobotAspek,
      })
    }

    // Sort by score and get the best
    allJurusanScores.sort((a, b) => b.sawScore - a.sawScore)
    const bestMajor = allJurusanScores[0]

    // Save hasil tes
    const createResult = (await query(
      `INSERT INTO hasil_tes (siswa_id, skor_akhir, jurusan_rekomendasi_id, status)
       VALUES (?, ?, ?, ?)`,
      [siswaId, bestMajor.sawScore, bestMajor.jurusanId, "selesai"],
    )) as any

    const hasilTesId = createResult.insertId

    // Save jawaban
    for (const [soalId, pilihanId] of Object.entries(jawaban)) {
      await query(
        `INSERT INTO jawaban_tes (hasil_tes_id, soal_id, pilihan_id)
         VALUES (?, ?, ?)`,
        [hasilTesId, Number.parseInt(soalId), pilihanId],
      )
    }

    // Save SAW scores
    for (const score of allJurusanScores) {
      await query(
        `INSERT INTO skor_saw (hasil_tes_id, jurusan_id, skor)
         VALUES (?, ?, ?)`,
        [hasilTesId, score.jurusanId, score.sawScore],
      )
    }

    return {
      bestMajor,
      allScores: allJurusanScores,
      hasilTesId,
    }
  } catch (error) {
    console.error("SAW calculation error:", error)
    throw error
  }
}
