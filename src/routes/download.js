const express = require('express');
const router = express.Router();
const { getDaftarDownload, getDownloadById, tambahDownload, updateDownload, hapusDownload, incrementUnduhan } = require('../controllers/downloadController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', getDaftarDownload);
router.get('/:id', getDownloadById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahDownload);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateDownload);
router.delete('/:id', verifyToken, requireRole('admin'), hapusDownload);
router.patch('/:id/unduh', incrementUnduhan);

module.exports = router;
