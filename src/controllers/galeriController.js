const pool = require('../database/db');

const getDaftarGaleri = async (req, res) => {
  try {
    const { kegiatan_id } = req.query;
    let query = `
      SELECT g.*, u.nama as uploaded_by_nama, k.judul as kegiatan_judul
      FROM galeri g
      LEFT JOIN users u ON g.uploaded_by = u.id
      LEFT JOIN kegiatan k ON g.kegiatan_id = k.id
    `;
    const params = [];
    if (kegiatan_id) {
      query += ` WHERE g.kegiatan_id = $1`;
      params.push(kegiatan_id);
    }
    query += ` ORDER BY g.created_at DESC`;
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGaleriById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT g.*, u.nama as uploaded_by_nama, k.judul as kegiatan_judul
      FROM galeri g
      LEFT JOIN users u ON g.uploaded_by = u.id
      LEFT JOIN kegiatan k ON g.kegiatan_id = k.id
      WHERE g.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foto tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahGaleri = async (req, res) => {
  const { judul, url_foto, kegiatan_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO galeri (uploaded_by, judul, url_foto, kegiatan_id)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [req.user.id, judul, url_foto, kegiatan_id || null]);
    res.status(201).json({ message: 'Foto berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGaleri = async (req, res) => {
  const { id } = req.params;
  const { judul, url_foto, kegiatan_id } = req.body;
  try {
    const result = await pool.query(`
      UPDATE galeri
      SET judul=$1, url_foto=$2, kegiatan_id=$3
      WHERE id=$4 RETURNING *
    `, [judul, url_foto, kegiatan_id || null, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foto tidak ditemukan' });
    }
    res.json({ message: 'Foto berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM galeri WHERE id = $1', [id]);
    res.json({ message: 'Foto berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarGaleri, getGaleriById, tambahGaleri, updateGaleri, hapusGaleri };
