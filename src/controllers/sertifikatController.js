const pool = require('../database/db');

const getDaftarSertifikat = async (req, res) => {
  try {
    const { anggota_id, kegiatan_id } = req.query;
    let query = `
      SELECT s.*, 
             u.nama as anggota_nama,
             a.nta, a.golongan,
             k.judul as kegiatan_judul
      FROM sertifikat s
      LEFT JOIN anggota a ON s.anggota_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN kegiatan k ON s.kegiatan_id = k.id
      WHERE 1=1
    `;
    const params = [];
    if (anggota_id) {
      params.push(anggota_id);
      query += ` AND s.anggota_id = $${params.length}`;
    }
    if (kegiatan_id) {
      params.push(kegiatan_id);
      query += ` AND s.kegiatan_id = $${params.length}`;
    }
    query += ` ORDER BY s.created_at DESC`;
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSertifikatById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*,
             u.nama as anggota_nama,
             a.nta, a.golongan,
             k.judul as kegiatan_judul
      FROM sertifikat s
      LEFT JOIN anggota a ON s.anggota_id = a.id
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN kegiatan k ON s.kegiatan_id = k.id
      WHERE s.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const tambahSertifikat = async (req, res) => {
  const { anggota_id, kegiatan_id, nomor_sertifikat, file_url, tanggal_terbit } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO sertifikat (anggota_id, kegiatan_id, nomor_sertifikat, file_url, tanggal_terbit)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [anggota_id, kegiatan_id, nomor_sertifikat, file_url, tanggal_terbit]);
    res.status(201).json({ message: 'Sertifikat berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSertifikat = async (req, res) => {
  const { id } = req.params;
  const { nomor_sertifikat, file_url, tanggal_terbit } = req.body;
  try {
    const result = await pool.query(`
      UPDATE sertifikat
      SET nomor_sertifikat=$1, file_url=$2, tanggal_terbit=$3
      WHERE id=$4 RETURNING *
    `, [nomor_sertifikat, file_url, tanggal_terbit, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sertifikat tidak ditemukan' });
    }
    res.json({ message: 'Sertifikat berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const hapusSertifikat = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sertifikat WHERE id = $1', [id]);
    res.json({ message: 'Sertifikat berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDaftarSertifikat, getSertifikatById, tambahSertifikat, updateSertifikat, hapusSertifikat };
