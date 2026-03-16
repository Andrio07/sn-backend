const express = require('express');
const router = express.Router();
const { getDaftarAnggota, getAnggotaById, tambahAnggota, updateAnggota, hapusAnggota } = require('../controllers/anggotaController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getDaftarAnggota);
router.get('/:id', verifyToken, getAnggotaById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahAnggota);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateAnggota);
router.delete('/:id', verifyToken, requireRole('admin'), hapusAnggota);

module.exports = router;
