const prisma = require('../configs/prisma');

class KategoriService {
  async createKategori(kategoriData) {
    const { nama, deskripsi } = kategoriData;

    const existingKategori = await prisma.kategori.findUnique({
      where: { nama }
    });

    if (existingKategori) {
      throw new Error('Kategori dengan nama tersebut sudah ada');
    }

    return await prisma.kategori.create({
      data: {
        nama,
        deskripsi
      }
    });
  }

  async getAllKategori() {
    return await prisma.kategori.findMany({
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

  async getKategoriById(id) {
    const kategori = await prisma.kategori.findUnique({
      where: { id },
      include: {
        barang: {
          include: {
            merek: true,
            lokasi: true
          }
        },
        _count: {
          select: { barang: true }
        }
      }
    });

    if (!kategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    return kategori;
  }

  async updateKategori(id, kategoriData) {
    const { nama, deskripsi } = kategoriData;
    
    await this.getKategoriById(id);

    if (nama) {
      const existingKategori = await prisma.kategori.findFirst({
        where: {
          nama,
          NOT: { id }
        }
      });

      if (existingKategori) {
        throw new Error('Kategori dengan nama tersebut sudah ada');
      }
    }

    return await prisma.kategori.update({
      where: { id },
      data: {
        nama,
        deskripsi
      }
    });
  }

  async deleteKategori(id) {
    const kategori = await this.getKategoriById(id);
    
    if (kategori._count.barang > 0) {
      throw new Error('Kategori tidak dapat dihapus karena masih memiliki barang');
    }

    return await prisma.kategori.delete({
      where: { id }
    });
  }
}

module.exports = new KategoriService();