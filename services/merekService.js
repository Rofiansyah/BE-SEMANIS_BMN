const prisma = require('../configs/prisma');

class MerekService {
  async createMerek(merekData) {
    const { nama, deskripsi } = merekData;

    const existingMerek = await prisma.merek.findUnique({
      where: { nama }
    });

    if (existingMerek) {
      throw new Error('Merek dengan nama tersebut sudah ada');
    }

    return await prisma.merek.create({
      data: {
        nama,
        deskripsi
      }
    });
  }

  async getAllMerek() {
    return await prisma.merek.findMany({
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

  async getMerekById(id) {
    const merek = await prisma.merek.findUnique({
      where: { id },
      include: {
        barang: {
          include: {
            kategori: true,
            lokasi: true
          }
        },
        _count: {
          select: { barang: true }
        }
      }
    });

    if (!merek) {
      throw new Error('Merek tidak ditemukan');
    }

    return merek;
  }

  async updateMerek(id, merekData) {
    const { nama, deskripsi } = merekData;
    
    await this.getMerekById(id);

    if (nama) {
      const existingMerek = await prisma.merek.findFirst({
        where: {
          nama,
          NOT: { id }
        }
      });

      if (existingMerek) {
        throw new Error('Merek dengan nama tersebut sudah ada');
      }
    }

    return await prisma.merek.update({
      where: { id },
      data: {
        nama,
        deskripsi
      }
    });
  }

  async deleteMerek(id) {
    const merek = await this.getMerekById(id);
    
    if (merek._count.barang > 0) {
      throw new Error('Merek tidak dapat dihapus karena masih memiliki barang');
    }

    return await prisma.merek.delete({
      where: { id }
    });
  }
}

module.exports = new MerekService();