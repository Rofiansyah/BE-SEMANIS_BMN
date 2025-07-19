const { validationResult } = require('express-validator');
const barangService = require('../services/barangService');

class BarangController {
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

      const barang = await barangService.createBarang(req.body, req.file);
      
      res.status(201).json({
        success: true,
        message: 'Barang berhasil dibuat',
        data: barang
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
      const barang = await barangService.getAllBarang();
      
      res.status(200).json({
        success: true,
        message: 'Data barang berhasil diambil',
        data: barang
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
      const barang = await barangService.getBarangById(id);
      
      res.status(200).json({
        success: true,
        message: 'Data barang berhasil diambil',
        data: barang
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
      const barang = await barangService.updateBarang(id, req.body, req.file);
      
      res.status(200).json({
        success: true,
        message: 'Barang berhasil diupdate',
        data: barang
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
      await barangService.deleteBarang(id);
      
      res.status(200).json({
        success: true,
        message: 'Barang berhasil dihapus'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getByKodeBarang(req, res) {
    try {
      const { kodeBarang } = req.params;
      const barang = await barangService.getBarangByKode(kodeBarang);
      
      res.status(200).json({
        success: true,
        message: 'Data barang berhasil diambil',
        data: barang
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new BarangController();