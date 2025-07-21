require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const merekRoutes = require('./routes/merekRoutes');
const lokasiRoutes = require('./routes/lokasiRoutes');
const barangRoutes = require('./routes/barangRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://inventaris-fe.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Reset password page route
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
});

app.use('/auth', authRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/merek', merekRoutes);
app.use('/lokasi', lokasiRoutes);
app.use('/barang', barangRoutes);
app.use('/peminjaman', peminjamanRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventaris API is running!',
    endpoints: {
      auth: '/auth',
      kategori: '/kategori',
      merek: '/merek',
      lokasi: '/lokasi',
      barang: '/barang',
      peminjaman: '/peminjaman'
    }
  });
});

module.exports = app;