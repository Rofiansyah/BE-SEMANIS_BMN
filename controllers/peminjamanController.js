const peminjamanService = require('../services/peminjamanService');

const createPeminjamanRequest = async (req, res) => {
  try {
    const { barangId, catatan } = req.body;
    const userId = req.user.id;
    
    if (!barangId) {
      return res.status(400).json({
        status: 'error',
        message: 'Barang ID harus diisi'
      });
    }
    
    const peminjaman = await peminjamanService.createPeminjamanRequest({
      userId,
      barangId,
      catatan
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Permintaan peminjaman berhasil dibuat',
      data: peminjaman
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const getUserPeminjaman = async (req, res) => {
  try {
    const userId = req.user.id;
    const peminjaman = await peminjamanService.getPeminjamanByUserId(userId);
    
    res.json({
      status: 'success',
      data: peminjaman
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getUserPeminjamanHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await peminjamanService.getUserPeminjamanHistory(userId);
    
    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAdminPeminjamanHistory = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat melihat semua history.'
      });
    }
    
    const history = await peminjamanService.getAllPeminjamanHistory();
    
    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getPeminjamanById = async (req, res) => {
  try {
    const { id } = req.params;
    const peminjaman = await peminjamanService.getPeminjamanById(id);
    
    if (!peminjaman) {
      return res.status(404).json({
        status: 'error',
        message: 'Data peminjaman tidak ditemukan'
      });
    }
    
    if (req.user.role !== 'ADMIN' && peminjaman.userId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Tidak memiliki akses ke data ini'
      });
    }
    
    res.json({
      status: 'success',
      data: peminjaman
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAllPeminjamanRequests = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat melihat semua permintaan.'
      });
    }
    
    const requests = await peminjamanService.getAllPeminjamanRequests();
    
    res.json({
      status: 'success',
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const approvePeminjamanRequest = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat menyetujui permintaan.'
      });
    }
    
    const { id } = req.params;
    const { penanggungJawab } = req.body;
    const approvedBy = req.user.id;
    
    if (!penanggungJawab) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama penanggung jawab harus diisi'
      });
    }
    
    const peminjaman = await peminjamanService.approvePeminjamanRequest(
      id, 
      approvedBy, 
      penanggungJawab, 
      req.file
    );
    
    res.json({
      status: 'success',
      message: 'Permintaan peminjaman berhasil disetujui',
      data: peminjaman
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const rejectPeminjamanRequest = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat menolak permintaan.'
      });
    }
    
    const { id } = req.params;
    const { catatan } = req.body;
    const approvedBy = req.user.id;
    
    const peminjaman = await peminjamanService.rejectPeminjamanRequest(
      id, 
      approvedBy, 
      catatan
    );
    
    res.json({
      status: 'success',
      message: 'Permintaan peminjaman berhasil ditolak',
      data: peminjaman
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const returnBarang = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat memproses pengembalian.'
      });
    }
    
    const { id } = req.params;
    const { penanggungJawab, catatan } = req.body;
    
    if (!penanggungJawab) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama penanggung jawab harus diisi'
      });
    }
    
    const peminjaman = await peminjamanService.returnBarang(
      id, 
      penanggungJawab, 
      req.file, 
      catatan
    );
    
    res.json({
      status: 'success',
      message: 'Barang berhasil dikembalikan',
      data: peminjaman
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const getPeminjamanReports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat melihat laporan.'
      });
    }
    
    const reports = await peminjamanService.getPeminjamanReports();
    
    res.json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createPeminjamanRequest,
  getUserPeminjaman,
  getUserPeminjamanHistory,
  getAdminPeminjamanHistory,
  getPeminjamanById,
  getAllPeminjamanRequests,
  approvePeminjamanRequest,
  rejectPeminjamanRequest,
  returnBarang,
  getPeminjamanReports
};