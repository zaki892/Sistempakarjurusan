const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistem_pakar_jurusan'
  });
  const [rows] = await conn.execute('SHOW TABLES LIKE "jurusan"');
  console.log('Jurusan table exists:', rows.length > 0);
  if (rows.length > 0) {
    const [data] = await conn.execute('SELECT COUNT(*) as count FROM jurusan');
    console.log('Jurusan count:', data[0].count);
  }
  conn.end();
})();
