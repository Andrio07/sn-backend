const pool = require('../database/db');

const getDaftarKegiatan = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT k.*, u.nama as created_by_nama
      FROM kegiatan k
      LEFT JOIN users u ON k.created_by = u.id
      ORDER BY k.tanggal_mulai DESC
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getKegiatanById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT k.*, u.nama as created_by_nama
      FROM kegiatan k
      LEFT JOIN users u ON k.created_by = u.id
      WHERE k.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahKegiatan = async (req, res) => {
  const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, foto_cover } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO kegiatan (created_by, judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, foto_cover)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [req.user.id, judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, foto_cover]);
    res.status(201).json({ message: 'Kegiatan berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateKegiatan = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, foto_cover } = req.body;
  try {
    const result = await pool.query(`
      UPDATE kegiatan
      SET judul=$1, deskripsi=$2, tanggal_mulai=$3, tanggal_selesai=$4, lokasi=$5, foto_cover=$6
      WHERE id=$7 RETURNING *
    `, [judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, foto_cover, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
    res.json({ message: 'Kegiatan berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusKegiatan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM kegiatan WHERE id = $1', [id]);
    res.json({ message: 'Kegiatan berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarKegiatan, getKegiatanById, tambahKegiatan, updateKegiatan, hapusKegiatan };
