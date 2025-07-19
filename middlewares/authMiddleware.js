const jwt = require('jsonwebtoken');
const prisma = require('../configs/prisma');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token diperlukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, nama: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication diperlukan' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Tidak memiliki akses untuk resource ini' });
    }

    next();
  };
};

const requireAdmin = requireRole(['ADMIN']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin
};