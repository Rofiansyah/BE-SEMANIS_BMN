const prisma = require('../configs/prisma');

class StatisticsService {
  async getStatistics() {
    const [totalBarang, totalUserRoleUsers, damagedItems, goodItems] = await Promise.all([
      prisma.barang.count(),
      prisma.user.count({
        where: {
          role: 'USER'
        }
      }),
      prisma.barang.count({
        where: {
          kondisi: {
            in: ['RUSAK_RINGAN', 'RUSAK_BERAT']
          }
        }
      }),
      prisma.barang.count({
        where: {
          kondisi: 'BAIK'
        }
      })
    ]);

    return {
      totalBarang,
      totalUserRoleUsers,
      barangRusak: damagedItems,
      barangBaik: goodItems
    };
  }
}

module.exports = new StatisticsService();