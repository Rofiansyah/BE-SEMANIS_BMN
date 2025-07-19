const prisma = require('../configs/prisma');

class LokasiService {
  async createLokasi(lokasiData) {
    const { nama, deskripsi } = lokasiData;

    const existingLokasi = await prisma.lokasi.findUnique({
      where: { nama }
    });

    if (existingLokasi) {
      throw new Error('Lokasi dengan nama tersebut sudah ada');
    }

    return await prisma.lokasi.create({
      data: {
        nama,
        deskripsi
      }
    });
  }

  async getAllLokasi() {
    return await prisma.lokasi.findMany({
      include: {
        _count: {
          select: { barang: true }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });
  }

  async getLokasiById(id) {
    const lokasi = await prisma.lokasi.findUnique({
      where: { id },
      include: {
        barang: {
          include: {
            kategori: true,
            merek: true
          }
        },
        _count: {
          select: { barang: true }
        }
      }
    });

    if (!lokasi) {
      throw new Error('Lokasi tidak ditemukan');
    }

    return lokasi;
  }

  async updateLokasi(id, lokasiData) {
    const { nama, deskripsi } = lokasiData;
    
    await this.getLokasiById(id);

    if (nama) {
      const existingLokasi = await prisma.lokasi.findFirst({
        where: {
          nama,
          NOT: { id }
        }
      });

      if (existingLokasi) {
        throw new Error('Lokasi dengan nama tersebut sudah ada');
      }
    }

    return await prisma.lokasi.update({
      where: { id },
      data: {
        nama,
        deskripsi
      }
    });
  }

  async deleteLokasi(id) {
    const lokasi = await this.getLokasiById(id);
    
    if (lokasi._count.barang > 0) {
      throw new Error('Lokasi tidak dapat dihapus karena masih memiliki barang');
    }

    return await prisma.lokasi.delete({
      where: { id }
    });
  }
}

module.exports = new LokasiService();