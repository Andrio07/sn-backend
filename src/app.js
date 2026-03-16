const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/db');

const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/anggota', anggotaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SN Backend berjalan!' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
