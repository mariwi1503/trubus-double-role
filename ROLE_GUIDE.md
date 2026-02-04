# Mode Pengguna - Panduan

Aplikasi Halo Trubus mendukung dua mode pengguna berbeda dengan fitur yang disesuaikan untuk setiap role.

## Mode Demo Login

Saat membuka aplikasi, Anda akan melihat modal login dengan **2 tombol mode demo**:

### 1. Mode Pelanggan (Konsumen)
- **Email**: `pelanggan@halo.com`
- **Password**: `password123`
- **Fitur Utama**:
  - 🏠 **Beranda** - Jelajahi produk dan ahli terkemuka
  - 🛒 **Belanja** - Beli pupuk, bibit, dan peralatan pertanian
  - 💬 **Konsultasi** - Chat dengan ahli pertanian
  - 📚 **Artikel** - Baca tips dan panduan dari para ahli
  - 👤 **Profil** - Kelola akun dan riwayat transaksi

### 2. Mode Ahli (Expert)
- **Email**: `ahli@halo.com`
- **Password**: `password123`
- **Fitur Utama** (hanya untuk ahli):
  - 💬 **Konsultasi** - Terima pertanyaan dari pelanggan, kelola sesi konsultasi
  - 📚 **Artikel** - Tulis dan publikasikan artikel edukatif
  - 👤 **Profil** - Kelola profil ahli, lihat pendapatan, dan sesi aktif

## Perbedaan Tampilan

### Navigasi Bawah (Bottom Navigation)
- **Pelanggan**: Home, Belanja, Konsultasi, Artikel, Profil (5 tab)
- **Ahli**: Konsultasi, Artikel, Profil (3 tab)

### Header
- **Pelanggan**: Logo, Notifikasi, Keranjang, Search bar
- **Ahli**: Logo, Nama Pengguna, Avatar (profil yang diverifikasi)

### Tab Profil
- **Pelanggan**: 
  - Pesanan Saya
  - Riwayat Konsultasi
  - Produk Favorit
  - Metode Pembayaran
  
- **Ahli**:
  - Sesi Konsultasi (5 sesi aktif)
  - Artikel Saya (12 artikel)
  - Dompet & Pendapatan

## Cara Menggunakan

1. Buka aplikasi
2. Klik salah satu tombol mode demo (Pelanggan atau Ahli)
3. Email dan password akan otomatis terisi
4. Klik "Masuk"
5. Anda akan dialihkan ke dashboard sesuai role Anda

## Fitur Switching

Di tab **Profil**, Anda dapat beralih antara mode Konsumen dan Ahli menggunakan tombol toggle di bagian atas profil (hanya untuk demo, tidak akan mengubah role yang sebenarnya di backend).

---

**Catatan**: Ini adalah aplikasi mockup untuk keperluan demonstrasi. Fitur-fitur ini akan terhubung ke API backend sesungguhnya di tahap produksi.
