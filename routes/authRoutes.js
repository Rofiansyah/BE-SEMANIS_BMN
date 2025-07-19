const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email harus valid'),
  body('nama')
    .notEmpty()
    .withMessage('Nama tidak boleh kosong')
    .isLength({ min: 2 })
    .withMessage('Nama minimal 2 karakter'),
  body('nomorhp')
    .notEmpty()
    .withMessage('Nomor HP tidak boleh kosong')
    .isMobilePhone('id-ID')
    .withMessage('Nomor HP harus valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
];

const adminRegisterValidation = [
  body('email')
    .isEmail()
    .withMessage('Email harus valid'),
  body('nama')
    .notEmpty()
    .withMessage('Nama tidak boleh kosong')
    .isLength({ min: 2 })
    .withMessage('Nama minimal 2 karakter'),
  body('nomorhp')
    .notEmpty()
    .withMessage('Nomor HP tidak boleh kosong')
    .isMobilePhone('id-ID')
    .withMessage('Nomor HP harus valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  body('role')
    .notEmpty()
    .withMessage('Role wajib diisi')
    .isIn(['ADMIN', 'USER'])
    .withMessage('Role harus ADMIN atau USER')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email harus valid'),
  body('password')
    .notEmpty()
    .withMessage('Password tidak boleh kosong')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email harus valid')
    .notEmpty()
    .withMessage('Email tidak boleh kosong')
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token tidak boleh kosong'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
    .notEmpty()
    .withMessage('Password baru tidak boleh kosong')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);

router.post('/admin/register', 
  authenticateToken, 
  requireAdmin, 
  adminRegisterValidation, 
  authController.register
);

module.exports = router;