const express = require('express');
const router = express.Router();
const { getDaftarSertifikat, getSertifikatById, tambahSertifikat, updateSertifikat, hapusSertifikat } = require('../controllers/sertifikatController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getDaftarSertifikat);
router.get('/:id', verifyToken, getSertifikatById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahSertifikat);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateSertifikat);
router.delete('/:id', verifyToken, requireRole('admin'), hapusSertifikat);

module.exports = router;
