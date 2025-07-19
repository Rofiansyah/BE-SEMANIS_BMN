const express = require('express');
const { body } = require('express-validator');
const merekController = require('../controllers/merekController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

const merekValidation = [
  body('nama')
    .notEmpty()
    .withMessage('Nama merek tidak boleh kosong')
    .isLength({ min: 2 })
    .withMessage('Nama merek minimal 2 karakter'),
  body('deskripsi')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Deskripsi maksimal 255 karakter')
];

router.get('/', merekController.getAll);
router.get('/:id', merekController.getById);

router.post('/', 
  authenticateToken, 
  requireAdmin, 
  merekValidation, 
  merekController.create
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  merekValidation, 
  merekController.update
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  merekController.delete
);

module.exports = router;