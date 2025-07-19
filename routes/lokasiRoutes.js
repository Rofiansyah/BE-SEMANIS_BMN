const express = require('express');
const { body } = require('express-validator');
const lokasiController = require('../controllers/lokasiController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

const lokasiValidation = [
  body('nama')
    .notEmpty()
    .withMessage('Nama lokasi tidak boleh kosong')
    .isLength({ min: 2 })
    .withMessage('Nama lokasi minimal 2 karakter')
];

router.get('/', lokasiController.getAll);
router.get('/:id', lokasiController.getById);

router.post('/', 
  authenticateToken, 
  requireAdmin, 
  lokasiValidation, 
  lokasiController.create
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  lokasiValidation, 
  lokasiController.update
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  lokasiController.delete
);

module.exports = router;