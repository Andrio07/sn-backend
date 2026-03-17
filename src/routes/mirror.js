const express = require('express');
const router = express.Router();
const { getDaftarMirror, getMirrorById, tambahMirror, updateMirror, hapusMirror, syncMirror } = require('../controllers/mirrorController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', getDaftarMirror);
router.get('/:id', getMirrorById);
router.post('/', verifyToken, requireRole('admin'), tambahMirror);
router.put('/:id', verifyToken, requireRole('admin'), updateMirror);
router.delete('/:id', verifyToken, requireRole('admin'), hapusMirror);
router.patch('/:id/sync', verifyToken, requireRole('admin'), syncMirror);

module.exports = router;
