const bcrypt = require("bcryptjs")

// List of users with their passwords
const users = [
  // Siswa
  { email: 'siswa001@sman1cibungbulang.sch.id', password: 'siswa001pass' },
  { email: 'siswa002@sman1cibungbulang.sch.id', password: 'siswa002pass' },
  { email: 'siswa003@sman1cibungbulang.sch.id', password: 'siswa003pass' },
  { email: 'siswa004@sman1cibungbulang.sch.id', password: 'siswa004pass' },
  { email: 'siswa005@sman1cibungbulang.sch.id', password: 'siswa005pass' },
  { email: 'siswa006@sman1cibungbulang.sch.id', password: 'siswa006pass' },
  { email: 'siswa007@sman1cibungbulang.sch.id', password: 'siswa007pass' },
  { email: 'siswa008@sman1cibungbulang.sch.id', password: 'siswa008pass' },
  { email: 'siswa009@sman1cibungbulang.sch.id', password: 'siswa009pass' },
  { email: 'siswa010@sman1cibungbulang.sch.id', password: 'siswa010pass' },

  // Guru
  { email: 'guru001@sman1cibungbulang.sch.id', password: 'guru001pass' },
  { email: 'guru002@sman1cibungbulang.sch.id', password: 'guru002pass' },
  { email: 'guru003@sman1cibungbulang.sch.id', password: 'guru003pass' },

  // Kepala Sekolah
  { email: 'kepala@sman1cibungbulang.sch.id', password: 'kepalapass' },
]

async function generateHashes() {
  console.log("Generating unique password hashes for all users...\n")

  const hashedUsers = []

  for (const user of users) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    hashedUsers.push({
      email: user.email,
      password: user.password,
      hash: hash
    })
    console.log(`Email: ${user.email}`)
    console.log(`Password: ${user.password}`)
    console.log(`Hash: ${hash}`)
    console.log('---')
  }

  console.log("\n=== SQL INSERT STATEMENTS ===")
  console.log("Copy and paste these INSERT statements into your SQL file:\n")

  // Siswa
  console.log("-- Insert Siswa")
  hashedUsers.filter(u => u.email.includes('siswa')).forEach(user => {
    const noInduk = user.email.split('@')[0].replace('siswa', '')
    const kelas = noInduk <= 3 ? '12-A' : noInduk <= 6 ? '12-B' : '12-C'
    const nama = `Siswa ${noInduk.padStart(3, '0')}`
    console.log(`('${user.email}', '${user.hash}', '${nama}', 'siswa', '${noInduk.padStart(3, '0')}', '${kelas}'),`)
  })

  // Guru
  console.log("\n-- Insert Guru")
  hashedUsers.filter(u => u.email.includes('guru')).forEach(user => {
    const noInduk = user.email.split('@')[0].replace('guru', '')
    const kelas = `12-${String.fromCharCode(65 + parseInt(noInduk) - 1)}` // 12-A, 12-B, 12-C
    const nama = `Guru ${noInduk.padStart(3, '0')}`
    console.log(`('${user.email}', '${user.hash}', '${nama}', 'guru', '${kelas}'),`)
  })

  // Kepala Sekolah
  console.log("\n-- Insert Kepala Sekolah")
  hashedUsers.filter(u => u.email.includes('kepala')).forEach(user => {
    console.log(`('${user.email}', '${user.hash}', 'Dr. Kepala Sekolah', 'kepala_sekolah'),`)
  })

  console.log("\n=== PASSWORD LIST FOR REFERENCE ===")
  console.log("Save this list for login testing:")
  hashedUsers.forEach(user => {
    console.log(`${user.email}: ${user.password}`)
  })
}

generateHashes().catch(console.error)
