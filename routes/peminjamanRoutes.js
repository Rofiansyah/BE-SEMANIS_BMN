const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../configs/multer');

router.post(
  '/request', 
  authenticateToken, 
  peminjamanController.createPeminjamanRequest
);

router.get(
  '/my-requests', 
  authenticateToken, 
  peminjamanController.getUserPeminjaman
);

router.get(
  '/my-history', 
  authenticateToken, 
  peminjamanController.getUserPeminjamanHistory
);

router.get(
  '/admin/all', 
  authenticateToken, 
  peminjamanController.getAllPeminjamanRequests
);

router.get(
  '/admin/reports', 
  authenticateToken, 
  peminjamanController.getPeminjamanReports
);

router.post(
  '/admin/:id/approve', 
  authenticateToken, 
  upload.single('fotoPinjam'),
  peminjamanController.approvePeminjamanRequest
);

router.post(
  '/admin/:id/reject', 
  authenticateToken, 
  peminjamanController.rejectPeminjamanRequest
);

router.post(
  '/admin/:id/return', 
  authenticateToken, 
  upload.single('fotoKembali'),
  peminjamanController.returnBarang
);

router.get(
  '/:id', 
  authenticateToken, 
  peminjamanController.getPeminjamanById
);

module.exports = router;