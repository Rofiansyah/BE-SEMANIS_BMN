const statisticsService = require('../services/statisticsService');

class StatisticsController {
  async getStatistics(req, res) {
    try {
      const statistics = await statisticsService.getStatistics();
      
      res.status(200).json({
        success: true,
        message: 'Data statistik berhasil diambil',
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StatisticsController();