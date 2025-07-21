const prisma = require('../configs/prisma');
const imagekit = require('../configs/imagekit');

const uploadImage = async (file, folder = '/peminjaman-photos') => {
  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: `${Date.now()}-${file.originalname}`,
    folder: folder
  });
  
  return uploadResponse.url;
};

const createPeminjamanRequest = async (data) => {
  const { userId, barangId, catatan } = data;
  
  const barang = await prisma.barang.findUnique({
    where: { id: barangId }
  });
  
  if (!barang) {
    throw new Error('Barang tidak ditemukan');
  }
  
  if (barang.status !== 'TERSEDIA') {
    throw new Error('Barang sedang tidak tersedia');
  }
  
  await prisma.barang.update({
    where: { id: barangId },
    data: { status: 'DALAM_PROSES_PEMINJAMAN' }
  });
  
  const peminjaman = await prisma.peminjaman.create({
    data: {
      userId,
      barangId,
      catatan,
      status: 'PENDING'
    },
    include: {
      user: {
        select: { id: true, nama: true, email: true }
      },
      barang: {
        select: { id: true, nama: true, kodeBarang: true }
      }
    }
  });
  
  return peminjaman;
};

const getPeminjamanByUserId = async (userId) => {
  return await prisma.peminjaman.findMany({
    where: { userId },
    include: {
      barang: {
        select: { 
          id: true, 
          nama: true, 
          kodeBarang: true, 
          fotoUrl: true,
          kategori: { select: { nama: true } },
          merek: { select: { nama: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getPeminjamanById = async (id) => {
  return await prisma.peminjaman.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, nama: true, email: true, nomorhp: true }
      },
      barang: {
        include: {
          kategori: true,
          merek: true,
          lokasi: true
        }
      },
      approvedByUser: {
        select: { id: true, nama: true, email: true }
      }
    }
  });
};

const getAllPeminjamanRequests = async () => {
  return await prisma.peminjaman.findMany({
    include: {
      user: {
        select: { id: true, nama: true, email: true, nomorhp: true }
      },
      barang: {
        include: {
          kategori: true,
          merek: true,
          lokasi: true
        }
      },
      approvedByUser: {
        select: { id: true, nama: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const approvePeminjamanRequest = async (id, approvedBy, penanggungJawab, fotoFile) => {
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
    include: { barang: true }
  });
  
  if (!peminjaman) {
    throw new Error('Permintaan peminjaman tidak ditemukan');
  }
  
  if (peminjaman.status !== 'PENDING') {
    throw new Error('Permintaan peminjaman sudah diproses');
  }
  
  let fotoPinjam = null;
  if (fotoFile) {
    fotoPinjam = await uploadImage(fotoFile, '/peminjaman-photos');
  }
  
  const updatedPeminjaman = await prisma.$transaction(async (prisma) => {
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { status: 'DIPINJAM' }
    });
    
    return await prisma.peminjaman.update({
      where: { id },
      data: {
        status: 'DIPINJAM',
        tanggalDisetujui: new Date(),
        tanggalDipinjam: new Date(),
        approvedBy,
        penanggungJawab,
        fotoPinjam
      },
      include: {
        user: {
          select: { id: true, nama: true, email: true }
        },
        barang: {
          select: { id: true, nama: true, kodeBarang: true }
        }
      }
    });
  });
  
  return updatedPeminjaman;
};

const rejectPeminjamanRequest = async (id, approvedBy, catatan) => {
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
    include: { barang: true }
  });
  
  if (!peminjaman) {
    throw new Error('Permintaan peminjaman tidak ditemukan');
  }
  
  if (peminjaman.status !== 'PENDING') {
    throw new Error('Permintaan peminjaman sudah diproses');
  }
  
  const updatedPeminjaman = await prisma.$transaction(async (prisma) => {
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { status: 'TERSEDIA' }
    });
    
    return await prisma.peminjaman.update({
      where: { id },
      data: {
        status: 'DITOLAK',
        tanggalDisetujui: new Date(),
        approvedBy,
        catatan
      },
      include: {
        user: {
          select: { id: true, nama: true, email: true }
        },
        barang: {
          select: { id: true, nama: true, kodeBarang: true }
        }
      }
    });
  });
  
  return updatedPeminjaman;
};

const returnBarang = async (id, penanggungJawab, fotoFile, catatan) => {
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
    include: { barang: true }
  });
  
  if (!peminjaman) {
    throw new Error('Data peminjaman tidak ditemukan');
  }
  
  if (peminjaman.status !== 'DIPINJAM') {
    throw new Error('Barang belum dipinjam atau sudah dikembalikan');
  }
  
  let fotoKembali = null;
  if (fotoFile) {
    fotoKembali = await uploadImage(fotoFile, '/return-photos');
  }
  
  const updatedPeminjaman = await prisma.$transaction(async (prisma) => {
    await prisma.barang.update({
      where: { id: peminjaman.barangId },
      data: { status: 'TERSEDIA' }
    });
    
    return await prisma.peminjaman.update({
      where: { id },
      data: {
        status: 'DIKEMBALIKAN',
        tanggalDikembalikan: new Date(),
        penanggungJawab,
        fotoKembali,
        catatan
      },
      include: {
        user: {
          select: { id: true, nama: true, email: true }
        },
        barang: {
          select: { id: true, nama: true, kodeBarang: true }
        }
      }
    });
  });
  
  return updatedPeminjaman;
};

const getPeminjamanReports = async () => {
  const pending = await prisma.peminjaman.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { nama: true, email: true } },
      barang: { select: { nama: true, kodeBarang: true } }
    }
  });
  
  const dipinjam = await prisma.peminjaman.findMany({
    where: { status: 'DIPINJAM' },
    include: {
      user: { select: { nama: true, email: true } },
      barang: { select: { nama: true, kodeBarang: true } }
    }
  });
  
  const dikembalikan = await prisma.peminjaman.findMany({
    where: { status: 'DIKEMBALIKAN' },
    include: {
      user: { select: { nama: true, email: true } },
      barang: { select: { nama: true, kodeBarang: true } }
    }
  });
  
  return {
    pending,
    dipinjam,
    dikembalikan,
    summary: {
      totalPending: pending.length,
      totalDipinjam: dipinjam.length,
      totalDikembalikan: dikembalikan.length
    }
  };
};

const getUserPeminjamanHistory = async (userId) => {
  return await prisma.peminjaman.findMany({
    where: { 
      userId,
      status: { in: ['DIKEMBALIKAN', 'DITOLAK'] }
    },
    include: {
      barang: {
        select: { 
          id: true, 
          nama: true, 
          kodeBarang: true, 
          fotoUrl: true,
          kategori: { select: { nama: true } },
          merek: { select: { nama: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  createPeminjamanRequest,
  getPeminjamanByUserId,
  getPeminjamanById,
  getAllPeminjamanRequests,
  approvePeminjamanRequest,
  rejectPeminjamanRequest,
  returnBarang,
  getPeminjamanReports,
  getUserPeminjamanHistory,
  uploadImage
};