const QRCode = require('qrcode');
const prisma = require('../configs/prisma');
const imagekit = require('../configs/imagekit');

class BarangService {
  async generateKodeBarang(kategoriId) {
    const kategori = await prisma.kategori.findUnique({
      where: { id: kategoriId }
    });

    if (!kategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    const prefix = `BRG-${kategori.nama.charAt(0).toUpperCase()}`;
    
    const lastBarang = await prisma.barang.findFirst({
      where: {
        kodeBarang: {
          startsWith: prefix
        }
      },
      orderBy: {
        kodeBarang: 'desc'
      }
    });

    let nextNumber = 1;
    if (lastBarang) {
      const lastNumber = parseInt(lastBarang.kodeBarang.slice(-3));
      nextNumber = lastNumber + 1;
    }

    const kodeBarang = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    return kodeBarang;
  }

  async generateQRCode(barangData) {
    const qrData = {
      kodeBarang: barangData.kodeBarang,
      nama: barangData.nama,
      deskripsi: barangData.deskripsi,
      kategori: barangData.kategori.nama,
      merek: barangData.merek.nama,
      lokasi: barangData.lokasi.nama,
      kondisi: barangData.kondisi
    };

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    const base64Data = qrCodeDataUrl.split(',')[1];
    
    const uploadResponse = await imagekit.upload({
      file: base64Data,
      fileName: `qr-${barangData.kodeBarang}.png`,
      folder: '/qr-codes'
    });

    return uploadResponse.url;
  }

  async uploadImage(file) {
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: '/barang-photos'
    });

    return uploadResponse.url;
  }

  async createBarang(barangData, fotoFile) {
    const { nama, deskripsi, kategoriId, merekId, lokasiId, kondisi } = barangData;

    const [kategori, merek, lokasi] = await Promise.all([
      prisma.kategori.findUnique({ where: { id: kategoriId } }),
      prisma.merek.findUnique({ where: { id: merekId } }),
      prisma.lokasi.findUnique({ where: { id: lokasiId } })
    ]);

    if (!kategori || !merek || !lokasi) {
      throw new Error('Kategori, Merek, atau Lokasi tidak ditemukan');
    }

    const kodeBarang = await this.generateKodeBarang(kategoriId);
    
    let fotoUrl = null;
    if (fotoFile) {
      fotoUrl = await this.uploadImage(fotoFile);
    }

    const barang = await prisma.barang.create({
      data: {
        kodeBarang,
        nama,
        deskripsi,
        kondisi,
        fotoUrl,
        kategoriId,
        merekId,
        lokasiId
      },
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      }
    });

    const qrCodeUrl = await this.generateQRCode(barang);

    const updatedBarang = await prisma.barang.update({
      where: { id: barang.id },
      data: { qrCodeUrl },
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      }
    });

    return updatedBarang;
  }

  async getAllBarang() {
    return await prisma.barang.findMany({
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getBarangById(id) {
    const barang = await prisma.barang.findUnique({
      where: { id },
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      }
    });

    if (!barang) {
      throw new Error('Barang tidak ditemukan');
    }

    return barang;
  }

  async updateBarang(id, barangData, fotoFile) {
    const existingBarang = await this.getBarangById(id);
    
    let fotoUrl = existingBarang.fotoUrl;
    if (fotoFile) {
      fotoUrl = await this.uploadImage(fotoFile);
    }

    const updatedBarang = await prisma.barang.update({
      where: { id },
      data: {
        ...barangData,
        fotoUrl
      },
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      }
    });

    if (barangData.kategoriId || barangData.merekId || barangData.lokasiId || barangData.kondisi || barangData.deskripsi || barangData.nama) {
      const qrCodeUrl = await this.generateQRCode(updatedBarang);
      await prisma.barang.update({
        where: { id },
        data: { qrCodeUrl }
      });
    }

    return updatedBarang;
  }

  async deleteBarang(id) {
    await this.getBarangById(id);
    return await prisma.barang.delete({
      where: { id }
    });
  }

  async getBarangByKode(kodeBarang) {
    const barang = await prisma.barang.findUnique({
      where: { kodeBarang },
      include: {
        kategori: true,
        merek: true,
        lokasi: true
      }
    });

    if (!barang) {
      throw new Error('Barang tidak ditemukan');
    }

    return barang;
  }
}

module.exports = new BarangService();