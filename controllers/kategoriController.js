const { validationResult } = require('express-validator');
const kategoriService = require('../services/kategoriService');

class KategoriController {
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

      const kategori = await kategoriService.createKategori(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        data: kategori
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
      const kategori = await kategoriService.getAllKategori();
      
      res.status(200).json({
        success: true,
        message: 'Data kategori berhasil diambil',
        data: kategori
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
      const kategori = await kategoriService.getKategoriById(id);
      
      res.status(200).json({
        success: true,
        message: 'Data kategori berhasil diambil',
        data: kategori
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
      const kategori = await kategoriService.updateKategori(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Kategori berhasil diupdate',
        data: kategori
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
      await kategoriService.deleteKategori(id);
      
      res.status(200).json({
        success: true,
        message: 'Kategori berhasil dihapus'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new KategoriController();