const express = require('express');
const router = express.Router();
const { getDaftarKegiatan, getKegiatanById, tambahKegiatan, updateKegiatan, hapusKegiatan } = require('../controllers/kegiatanController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', getDaftarKegiatan);
router.get('/:id', getKegiatanById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahKegiatan);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateKegiatan);
router.delete('/:id', verifyToken, requireRole('admin'), hapusKegiatan);

module.exports = router;
