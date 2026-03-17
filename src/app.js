const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/db');

const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');
const kegiatanRoutes = require('./routes/kegiatan');
const beritaRoutes = require('./routes/berita');
const galeriRoutes = require('./routes/galeri');
const downloadRoutes = require('./routes/download');
const sertifikatRoutes = require('./routes/sertifikat');
const mirrorRoutes = require('./routes/mirror');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/sertifikat', sertifikatRoutes);
app.use('/api/mirror', mirrorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SN Backend berjalan!' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
