const express = require('express');
const router = express.Router();
const { getDaftarBerita, getBeritaById, tambahBerita, updateBerita, hapusBerita } = require('../controllers/beritaController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', getDaftarBerita);
router.get('/:id', getBeritaById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahBerita);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateBerita);
router.delete('/:id', verifyToken, requireRole('admin'), hapusBerita);

module.exports = router;
