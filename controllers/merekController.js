const { validationResult } = require('express-validator');
const merekService = require('../services/merekService');

class MerekController {
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

      const merek = await merekService.createMerek(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Merek berhasil dibuat',
        data: merek
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
      const merek = await merekService.getAllMerek();
      
      res.status(200).json({
        success: true,
        message: 'Data merek berhasil diambil',
        data: merek
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
      const merek = await merekService.getMerekById(id);
      
      res.status(200).json({
        success: true,
        message: 'Data merek berhasil diambil',
        data: merek
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
      const merek = await merekService.updateMerek(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Merek berhasil diupdate',
        data: merek
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
      await merekService.deleteMerek(id);
      
      res.status(200).json({
        success: true,
        message: 'Merek berhasil dihapus'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new MerekController();