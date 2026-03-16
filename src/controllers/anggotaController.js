const pool = require('../database/db');

const getDaftarAnggota = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.nama, u.email, u.role, u.created_at,
             a.nta, a.golongan, a.gugus_depan, a.foto, a.tanggal_bergabung
      FROM users u
      LEFT JOIN anggota a ON u.id = a.user_id
      WHERE u.role = 'anggota'
      ORDER BY u.created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnggotaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT u.id, u.nama, u.email, u.role, u.created_at,
             a.nta, a.golongan, a.gugus_depan, a.foto, a.tanggal_bergabung
      FROM users u
      LEFT JOIN anggota a ON u.id = a.user_id
      WHERE u.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahAnggota = async (req, res) => {
  const { nama, email, password, nta, golongan, gugus_depan, tanggal_bergabung } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (nama, email, password_hash, role)
       VALUES ($1, $2, $3, 'anggota') RETURNING id`,
      [nama, email, password_hash]
    );
    const user_id = userResult.rows[0].id;
    await client.query(
      `INSERT INTO anggota (user_id, nta, golongan, gugus_depan, tanggal_bergabung)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, nta, golongan, gugus_depan, tanggal_bergabung]
    );
    await client.query('COMMIT');
    res.status(201).json({ message: 'Anggota berhasil ditambahkan' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const updateAnggota = async (req, res) => {
  const { id } = req.params;
  const { nama, nta, golongan, gugus_depan, tanggal_bergabung } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE users SET nama = $1 WHERE id = $2`,
      [nama, id]
    );
    await client.query(
      `INSERT INTO anggota (user_id, nta, golongan, gugus_depan, tanggal_bergabung)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE
       SET nta = $2, golongan = $3, gugus_depan = $4, tanggal_bergabung = $5`,
      [id, nta, golongan, gugus_depan, tanggal_bergabung]
    );
    await client.query('COMMIT');
    res.json({ message: 'Anggota berhasil diupdate' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const hapusAnggota = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Anggota berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarAnggota, getAnggotaById, tambahAnggota, updateAnggota, hapusAnggota };
