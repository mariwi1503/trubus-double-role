# Quick Start - Testing Dual Role UI

Panduan cepat untuk testing dan demo aplikasi dengan 2 mode user yang berbeda.

---

## ⚡ 30 Detik Setup

1. **Buka aplikasi** - Aplikasi akan langsung menampilkan modal login
2. **Pilih mode** - Klik salah satu dari 2 tombol:
   - `👥 Pelanggan` - Testing mode konsumen
   - `👨‍🌾 Ahli` - Testing mode ahli
3. **Klik Masuk** - Email & password sudah otomatis terisi
4. **Explore** - Lihat perbedaan UI antara kedua role

---

## 🎮 Test Scenarios

### Scenario 1: Consumer Experience (2 menit)

**Step 1: Login**
```
1. Klik tombol [👥 Pelanggan]
2. Verifikasi email: pelanggan@halo.com
3. Klik [Masuk]
```

**Step 2: Home Screen**
```
Verifikasi yang terlihat:
✓ Header dengan logo + search + cart
✓ 5 tabs di bawah: 🏠 🛒 💬 📚 👤
✓ Anda berada di tab Beranda
```

**Step 3: Explore Fitur**
```
🏠 Beranda     → Lihat produk & ahli terkemuka
🛒 Belanja     → Browse & add to cart
💬 Konsultasi  → Lihat daftar ahli
📚 Artikel     → Baca tips pertanian
👤 Profil      → Lihat info akun
```

---

### Scenario 2: Expert Experience (2 menit)

**Step 1: Login**
```
1. Klik tombol [👨‍🌾 Ahli]
2. Verifikasi email: ahli@halo.com
3. Klik [Masuk]
```

**Step 2: Home Screen**
```
Verifikasi yang terlihat:
✓ Header dengan logo + nama "Dr. Siti Nurhaliza" + avatar
✓ 3 tabs di bawah: 💬 📚 👤
✓ Anda berada di tab Konsultasi
✓ Tab "Beranda" & "Belanja" TIDAK terlihat
```

**Step 3: Explore Fitur**
```
💬 Konsultasi  → Kelola sesi konsultasi
   - Tab "Sesi Saya" untuk melihat konsultasi aktif
   - Tab "Cari Ahli" KHUSUS untuk testing (biasanya hanya Sesi Saya)

📚 Artikel     → Baca & kelola artikel
   - Sama seperti consumer tapi dengan fitur edit/publish

👤 Profil      → Info ahli & earnings
```

---

### Scenario 3: Role Switching (1 menit)

**Step 1: Masuk sebagai Pelanggan**
```
1. Login dengan Mode Pelanggan (lihat Scenario 1)
2. Navigasi ke tab 👤 Profil
```

**Step 2: Lihat Role Switcher**
```
Di dalam Profil View, lihat bagian atas:

┌─────────────────────────────┐
│ Profil Saya                 │
│                             │
│ [Konsumen] ✓     [Ahli]     │  ← Tombol toggle
│  (pilihan aktif)  (not picked)
└─────────────────────────────┘
```

**Step 3: Switch ke Ahli**
```
1. Klik tombol [Ahli]
2. Tunggu sebentar...
3. Verifikasi perubahan:
   - Nama berubah menjadi "Dr. Siti Nurhaliza"
   - Avatar muncul di header
   - Jumlah tab berubah dari 5 menjadi 3
   - Tab "Beranda" dan "Belanja" menghilang
```

**Step 4: Switch kembali ke Konsumen**
```
1. Klik tombol [Konsumen] di Profil
2. Verifikasi perubahan:
   - Nama berubah menjadi "Budi Santoso"
   - Avatar hilang dari header
   - Jumlah tab berubah dari 3 menjadi 5
   - Tab "Beranda" dan "Belanja" muncul kembali
```

---

### Scenario 4: Protected Routes (1 menit)

**Step 1: Login sebagai Ahli**
```
1. Login dengan Mode Ahli
2. Lihat Anda di tab Konsultasi
```

**Step 2: Try to Access Restricted Tab**
```
1. Perhatikan BottomNav hanya punya 3 tabs
2. Tab "Belanja" dan "Beranda" TIDAK ada
3. (Jika implementasi dengan redirect): 
   - Coba akses melalui URL atau code
   - Akan otomatis redirect ke Konsultasi
```

---

## 🔍 Verifikasi Checklist

### Setiap test, verifikasi hal berikut:

#### Consumer Mode
- [ ] Email: `pelanggan@halo.com`
- [ ] Password: `password123`
- [ ] Header: Logo + Search + Cart + Bell
- [ ] Tabs: 5 tabs visible (🏠 🛒 💬 📚 👤)
- [ ] Landing Tab: Beranda (Home)
- [ ] Nama: "Budi Santoso"
- [ ] Avatar: Default consumer avatar

#### Expert Mode
- [ ] Email: `ahli@halo.com`
- [ ] Password: `password123`
- [ ] Header: Logo + Dr. Siti Nurhaliza + Avatar
- [ ] Tabs: 3 tabs visible (💬 📚 👤)
- [ ] Landing Tab: Konsultasi (Consult)
- [ ] Nama: "Dr. Siti Nurhaliza"
- [ ] Avatar: Expert avatar visible

#### Role Switching
- [ ] Switch from Consumer → Expert works
- [ ] Switch from Expert → Consumer works
- [ ] Tabs update correctly after switching
- [ ] Header updates correctly after switching
- [ ] User data (name, avatar) updates correctly

---

## 💡 Tips & Tricks

### Mempercepat Testing
- Gunakan browser DevTools untuk clear cache jika perlu
- Tab Profil ada di paling kanan bottom nav
- Gunakan browser's back button untuk kembali (jika perlu)

### Demo untuk Stakeholder
1. **Show Consumer Path**: Login pelanggan → explore belanja & konsultasi
2. **Show Expert Path**: Login ahli → show konsultasi & artikel
3. **Show Flexibility**: Role switch di profil untuk demonstrate UI update

### Common Issues & Fixes

**Issue**: Tombol mode demo tidak terlihat
- **Fix**: Scroll ke atas di modal login

**Issue**: Tab tidak berubah setelah role switch
- **Fix**: Refresh page atau navigate ke tab lain dulu

**Issue**: Avatar tidak muncul di header expert
- **Fix**: Ensure Anda login sebagai ahli (email dengan 'ahli')

---

## 📸 Expected Output

### Consumer Login Success
```
Screen akan menampilkan:
✓ Header dengan search bar
✓ Produk featured & ahli terkemuka
✓ 5 navigation tabs di bawah
✓ Nama "Budi Santoso" di profil
```

### Expert Login Success
```
Screen akan menampilkan:
✓ Header dengan nama & avatar
✓ "Sesi Saya" tab di konsultasi
✓ 3 navigation tabs di bawah
✓ Nama "Dr. Siti Nurhaliza" di header & profil
```

---

## 🎯 Testing Goals

Gunakan scenarios ini untuk verify bahwa:

1. ✅ **Role Detection** - Email determines role correctly
2. ✅ **UI Differentiation** - Setiap role punya UI yang berbeda
3. ✅ **Navigation Filtering** - Tabs berubah sesuai role
4. ✅ **Header Adaptation** - Header berbeda untuk consumer vs expert
5. ✅ **Role Switching** - User bisa switch role di profil
6. ✅ **Data Persistence** - User data tetap sama saat navigation
7. ✅ **Protected Routes** - Expert tidak bisa akses consumer-only pages

---

## 🚀 Ready to Demo!

Semua fitur sudah siap. Ikuti scenarios di atas untuk complete testing.

**Waktu estimasi**: 5-10 menit untuk semua scenarios

**Next Steps**:
1. Test semua scenarios
2. Dokumentasi feedback
3. Prepare untuk integration dengan backend

---

**Happy Testing!** 🎉
