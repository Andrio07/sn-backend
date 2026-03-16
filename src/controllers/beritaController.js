const pool = require('../database/db');

const getDaftarBerita = async (req, res) => {
  try {
    const { published } = req.query;
    let query = `
      SELECT b.*, u.nama as author_nama
      FROM berita b
      LEFT JOIN users u ON b.author_id = u.id
    `;
    if (published === 'true') {
      query += ` WHERE b.published = true`;
    }
    query += ` ORDER BY b.created_at DESC`;
    const result = await pool.query(query);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBeritaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT b.*, u.nama as author_nama
      FROM berita b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahBerita = async (req, res) => {
  const { judul, konten, foto_cover, published } = req.body;
  try {
    const published_at = published ? new Date() : null;
    const result = await pool.query(`
      INSERT INTO berita (author_id, judul, konten, foto_cover, published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [req.user.id, judul, konten, foto_cover, published || false, published_at]);
    res.status(201).json({ message: 'Berita berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBerita = async (req, res) => {
  const { id } = req.params;
  const { judul, konten, foto_cover, published } = req.body;
  try {
    const current = await pool.query('SELECT published, published_at FROM berita WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    const wasPublished = current.rows[0].published;
    const published_at = published && !wasPublished ? new Date() : current.rows[0].published_at;
    const result = await pool.query(`
      UPDATE berita
      SET judul=$1, konten=$2, foto_cover=$3, published=$4, published_at=$5
      WHERE id=$6 RETURNING *
    `, [judul, konten, foto_cover, published, published_at, id]);
    res.json({ message: 'Berita berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusBerita = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM berita WHERE id = $1', [id]);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarBerita, getBeritaById, tambahBerita, updateBerita, hapusBerita };
