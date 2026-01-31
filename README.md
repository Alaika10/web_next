
# 🚀 Zenith | Professional Portfolio & CMS (Next.js 14)

Zenith adalah solusi portofolio digital modern yang dibangun dengan **Next.js 14 App Router**. Aplikasi ini bukan sekadar template statis, melainkan sistem manajemen konten (CMS) lengkap dengan fitur CRUD dan integrasi **Google Gemini AI** untuk membantu penulisan konten secara otomatis.

## ✨ Fitur Utama
- **Full CRUD Management**: Kelola Proyek, Artikel Blog, dan Profil secara dinamis.
- **AI Content Engine**: Integrasi Gemini AI untuk membuat draf artikel dan memoles deskripsi proyek.
- **Cloud Persistence**: Data tersimpan aman di Supabase (PostgreSQL).
- **Responsive Admin Dashboard**: Panel kontrol yang elegan dan mobile-friendly.
- **Modern UI/UX**: Didesain dengan Tailwind CSS, Glassmorphism, dan animasi halus.

---

## 🛠️ Panduan Instalasi Langkah-Demi-Langkah

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di mesin lokal Anda.

### Langkah 1: Inisialisasi Proyek Next.js
Buka terminal Anda dan jalankan perintah berikut:
```bash
npx create-next-app@latest zenith-portfolio --typescript --tailwind --eslint
```
*Pilih "Yes" untuk App Router dan "No" untuk folder src (atau sesuaikan dengan preferensi Anda).*

### Langkah 2: Instal Dependensi yang Dibutuhkan
Masuk ke folder proyek dan instal library pendukung:
```bash
cd zenith-portfolio
npm install @supabase/supabase-js @google/genai lucide-react recharts clsx tailwind-merge
```

### Langkah 3: Konfigurasi Environment Variables
Buat file bernama `.env.local` di akar folder proyek Anda dan isi dengan kunci API berikut:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI Configuration
API_KEY=your-google-ai-studio-key
```

### Langkah 4: Persiapan Database (Supabase)
Agar fitur CRUD berjalan, Anda perlu membuat tabel di dashboard Supabase melalui **SQL Editor**:

```sql
-- 1. Tabel Profil
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  name TEXT,
  title TEXT,
  about TEXT,
  avatar TEXT,
  skills JSONB,
  socials JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Proyek
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  technologies TEXT[],
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Blog
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  author TEXT,
  date DATE DEFAULT CURRENT_DATE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Langkah 5: Menjalankan Aplikasi
Setelah semua file dikonfigurasi, jalankan server pengembangan:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔐 Akses Admin (CMS)
Untuk mengelola konten, navigasikan ke rute `/login`.
- **URL**: `localhost:3000/#/login`
- **Default Username**: `admin`
- **Default Password**: `admin123` atau `zenith`

### Cara Menggunakan Fitur CRUD & AI:
1. **Blog**: Klik "Tambah Artikel", tulis judul saja, lalu gunakan tombol **"✨ AI Auto-Draft"** untuk membiarkan Gemini menulis isi artikel lengkap beserta summary-nya.
2. **Project**: Tambahkan proyek baru, masukkan nama teknologi (misal: React, Node.js), lalu klik **"Refine with AI"** untuk membuat deskripsi profesional secara instan.
3. **Profile**: Edit skill dan biografi Anda. Klik "Save All Profile Changes" untuk memperbarui tampilan di halaman About secara global.

---

## 📁 Struktur Folder Proyek
```text
.
├── app/                # Next.js App Router (Pages & Layouts)
│   ├── admin/          # Dashboard CRUD
│   ├── blog/           # Halaman List Artikel
│   ├── projects/       # Halaman Portofolio
│   └── layout.tsx      # Kerangka Global
├── components/         # Komponen UI Reusable (Navbar, Footer, dsb)
├── lib/                # Konfigurasi Supabase & Auth
├── services/           # Logika Google Gemini AI
├── types.ts            # Definisi Interface TypeScript
└── constants.ts        # Data Initial/Fallback
```

## 📝 Catatan Penting
- Pastikan **Google Gemini API Key** memiliki akses ke model `gemini-3-pro-preview` dan `gemini-3-flash-preview`.
- Perubahan pada admin dashboard akan langsung tersimpan ke database jika Supabase sudah terkonfigurasi dengan benar. Jika belum, aplikasi akan berjalan dalam **"Offline Mode"** (data hanya tersimpan di session browser).

---
*Dibuat dengan ❤️ menggunakan Next.js & Google Gemini API.*
