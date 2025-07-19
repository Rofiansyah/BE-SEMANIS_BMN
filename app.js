require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const merekRoutes = require('./routes/merekRoutes');
const lokasiRoutes = require('./routes/lokasiRoutes');
const barangRoutes = require('./routes/barangRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/merek', merekRoutes);
app.use('/lokasi', lokasiRoutes);
app.use('/barang', barangRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventaris API is running!',
    endpoints: {
      auth: '/auth',
      kategori: '/kategori',
      merek: '/merek',
      lokasi: '/lokasi',
      barang: '/barang'
    }
  });
});

module.exports = app;