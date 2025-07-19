const express = require('express');
const { body } = require('express-validator');
const barangController = require('../controllers/barangController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');
const upload = require('../configs/multer');

const router = express.Router();

const barangValidation = [
  body('deskripsi')
    .notEmpty()
    .withMessage('Deskripsi tidak boleh kosong')
    .isLength({ min: 5 })
    .withMessage('Deskripsi minimal 5 karakter'),
  body('kategoriId')
    .notEmpty()
    .withMessage('Kategori harus dipilih')
    .isUUID()
    .withMessage('Format kategori ID tidak valid'),
  body('merekId')
    .notEmpty()
    .withMessage('Merek harus dipilih')
    .isUUID()
    .withMessage('Format merek ID tidak valid'),
  body('lokasiId')
    .notEmpty()
    .withMessage('Lokasi harus dipilih')
    .isUUID()
    .withMessage('Format lokasi ID tidak valid'),
  body('kondisi')
    .optional()
    .isIn(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT', 'HILANG'])
    .withMessage('Kondisi harus salah satu dari: BAIK, RUSAK_RINGAN, RUSAK_BERAT, HILANG')
];

const barangUpdateValidation = [
  body('deskripsi')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Deskripsi minimal 5 karakter'),
  body('kategoriId')
    .optional()
    .isUUID()
    .withMessage('Format kategori ID tidak valid'),
  body('merekId')
    .optional()
    .isUUID()
    .withMessage('Format merek ID tidak valid'),
  body('lokasiId')
    .optional()
    .isUUID()
    .withMessage('Format lokasi ID tidak valid'),
  body('kondisi')
    .optional()
    .isIn(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT', 'HILANG'])
    .withMessage('Kondisi harus salah satu dari: BAIK, RUSAK_RINGAN, RUSAK_BERAT, HILANG')
];

router.get('/', barangController.getAll);
router.get('/:id', barangController.getById);
router.get('/kode/:kodeBarang', barangController.getByKodeBarang);

router.post('/', 
  authenticateToken, 
  requireAdmin,
  upload.single('foto'),
  barangValidation, 
  barangController.create
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin,
  upload.single('foto'),
  barangUpdateValidation, 
  barangController.update
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  barangController.delete
);

module.exports = router;