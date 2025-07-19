const { validationResult } = require('express-validator');
const lokasiService = require('../services/lokasiService');

class LokasiController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const lokasi = await lokasiService.createLokasi(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Lokasi berhasil dibuat',
        data: lokasi
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const lokasi = await lokasiService.getAllLokasi();
      
      res.status(200).json({
        success: true,
        message: 'Data lokasi berhasil diambil',
        data: lokasi
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const lokasi = await lokasiService.getLokasiById(id);
      
      res.status(200).json({
        success: true,
        message: 'Data lokasi berhasil diambil',
        data: lokasi
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const lokasi = await lokasiService.updateLokasi(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Lokasi berhasil diupdate',
        data: lokasi
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await lokasiService.deleteLokasi(id);
      
      res.status(200).json({
        success: true,
        message: 'Lokasi berhasil dihapus'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new LokasiController();