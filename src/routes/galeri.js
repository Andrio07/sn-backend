const express = require('express');
const router = express.Router();
const { getDaftarGaleri, getGaleriById, tambahGaleri, updateGaleri, hapusGaleri } = require('../controllers/galeriController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', getDaftarGaleri);
router.get('/:id', getGaleriById);
router.post('/', verifyToken, requireRole('admin', 'pengurus'), tambahGaleri);
router.put('/:id', verifyToken, requireRole('admin', 'pengurus'), updateGaleri);
router.delete('/:id', verifyToken, requireRole('admin'), hapusGaleri);

module.exports = router;
