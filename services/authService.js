const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../configs/prisma');

class AuthService {
  async register(userData) {
    const { email, nama, nomorhp, password, role } = userData;
    const userRole = role || 'USER';

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        nama,
        nomorhp,
        password: hashedPassword,
        role: userRole
      },
      select: {
        id: true,
        email: true,
        nama: true,
        nomorhp: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email atau password salah');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Email atau password salah');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      role: user.role
    };
  }

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nama: true,
        nomorhp: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    return user;
  }
}

module.exports = new AuthService();