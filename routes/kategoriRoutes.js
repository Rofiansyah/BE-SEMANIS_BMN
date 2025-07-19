const express = require('express');
const { body } = require('express-validator');
const kategoriController = require('../controllers/kategoriController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

const kategoriValidation = [
  body('nama')
    .notEmpty()
    .withMessage('Nama kategori tidak boleh kosong')
    .isLength({ min: 2 })
    .withMessage('Nama kategori minimal 2 karakter'),
  body('deskripsi')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Deskripsi maksimal 255 karakter')
];

router.get('/', kategoriController.getAll);
router.get('/:id', kategoriController.getById);

router.post('/', 
  authenticateToken, 
  requireAdmin, 
  kategoriValidation, 
  kategoriController.create
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  kategoriValidation, 
  kategoriController.update
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  kategoriController.delete
);

module.exports = router;