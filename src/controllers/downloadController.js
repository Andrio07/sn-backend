const pool = require('../database/db');

const getDaftarDownload = async (req, res) => {
  try {
    const { kategori } = req.query;
    let query = `
      SELECT d.*, u.nama as uploaded_by_nama
      FROM download d
      LEFT JOIN users u ON d.uploaded_by = u.id
    `;
    const params = [];
    if (kategori) {
      query += ` WHERE d.kategori = $1`;
      params.push(kategori);
    }
    query += ` ORDER BY d.created_at DESC`;
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDownloadById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT d.*, u.nama as uploaded_by_nama
      FROM download d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahDownload = async (req, res) => {
  const { judul, deskripsi, file_url, kategori } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO download (uploaded_by, judul, deskripsi, file_url, kategori)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [req.user.id, judul, deskripsi, file_url, kategori]);
    res.status(201).json({ message: 'File berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDownload = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, file_url, kategori } = req.body;
  try {
    const result = await pool.query(`
      UPDATE download
      SET judul=$1, deskripsi=$2, file_url=$3, kategori=$4
      WHERE id=$5 RETURNING *
    `, [judul, deskripsi, file_url, kategori, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }
    res.json({ message: 'File berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusDownload = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM download WHERE id = $1', [id]);
    res.json({ message: 'File berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const incrementUnduhan = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      UPDATE download SET jumlah_unduhan = jumlah_unduhan + 1
      WHERE id = $1 RETURNING jumlah_unduhan
    `, [id]);
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarDownload, getDownloadById, tambahDownload, updateDownload, hapusDownload, incrementUnduhan };
