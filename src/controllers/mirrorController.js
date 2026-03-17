const pool = require('../database/db');

const getDaftarMirror = async (req, res) => {
  try {
    const { nama_distro } = req.query;
    let query = `SELECT * FROM mirror_linux`;
    const params = [];
    if (nama_distro) {
      query += ` WHERE LOWER(nama_distro) = LOWER($1)`;
      params.push(nama_distro);
    }
    query += ` ORDER BY nama_distro, versi DESC`;
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMirrorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM mirror_linux WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mirror tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahMirror = async (req, res) => {
  const { nama_distro, versi, url_mirror, arsitektur, ukuran_bytes } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO mirror_linux (nama_distro, versi, url_mirror, arsitektur, ukuran_bytes, last_sync)
      VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
    `, [nama_distro, versi, url_mirror, arsitektur, ukuran_bytes]);
    res.status(201).json({ message: 'Mirror berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMirror = async (req, res) => {
  const { id } = req.params;
  const { nama_distro, versi, url_mirror, arsitektur, ukuran_bytes } = req.body;
  try {
    const result = await pool.query(`
      UPDATE mirror_linux
      SET nama_distro=$1, versi=$2, url_mirror=$3, arsitektur=$4, ukuran_bytes=$5, last_sync=NOW()
      WHERE id=$6 RETURNING *
    `, [nama_distro, versi, url_mirror, arsitektur, ukuran_bytes, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mirror tidak ditemukan' });
    }
    res.json({ message: 'Mirror berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusMirror = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mirror_linux WHERE id = $1', [id]);
    res.json({ message: 'Mirror berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const syncMirror = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      UPDATE mirror_linux SET last_sync = NOW()
      WHERE id = $1 RETURNING *
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mirror tidak ditemukan' });
    }
    res.json({ message: 'Sync berhasil', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarMirror, getMirrorById, tambahMirror, updateMirror, hapusMirror, syncMirror };
