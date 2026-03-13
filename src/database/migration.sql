CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'pengurus', 'anggota');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'anggota',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE anggota (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nta VARCHAR(50) UNIQUE,
  golongan VARCHAR(50),
  gugus_depan VARCHAR(100),
  foto VARCHAR(255),
  tanggal_bergabung DATE
);

CREATE TABLE kegiatan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES users(id),
  judul VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  lokasi VARCHAR(200),
  foto_cover VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id),
  judul VARCHAR(200) NOT NULL,
  konten TEXT,
  foto_cover VARCHAR(255),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE galeri (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID REFERENCES users(id),
  judul VARCHAR(200),
  url_foto VARCHAR(255) NOT NULL,
  kegiatan_id UUID REFERENCES kegiatan(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sertifikat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anggota_id UUID REFERENCES anggota(id) ON DELETE CASCADE,
  kegiatan_id UUID REFERENCES kegiatan(id) ON DELETE SET NULL,
  nomor_sertifikat VARCHAR(100) UNIQUE,
  file_url VARCHAR(255),
  tanggal_terbit DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE download (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploaded_by UUID REFERENCES users(id),
  judul VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  file_url VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  jumlah_unduhan INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mirror_linux (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_distro VARCHAR(100) NOT NULL,
  versi VARCHAR(50),
  url_mirror VARCHAR(500) NOT NULL,
  arsitektur VARCHAR(50),
  ukuran_bytes BIGINT,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
