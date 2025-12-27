# Quick Commands

\`\`\`bash
# Test database connection and password
node scripts/debug-complete.js

# Reset all passwords to "password123"
node scripts/reset-password.js

# Run development server
npm run dev

# Check MySQL status
mysql -u root -e "SELECT 1"
\`\`\`

---

# Test Credentials After Fix

| Email | Password | Role |
|-------|----------|------|
| siswa001@test.com | password123 | Siswa |
| guru001@test.com | password123 | Guru |
| kepala@test.com | password123 | Kepala Sekolah |
