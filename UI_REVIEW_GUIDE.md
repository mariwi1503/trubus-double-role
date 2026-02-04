# UI Review Guide - Halo Trubus Aplikasi

## 🎯 Status: Fully Standalone (No Backend/Database)

Aplikasi ini adalah **100% frontend-only mockup** dengan:
- ✅ Semua data menggunakan dummy data (dummyData.ts)
- ✅ Tidak ada integrasi Supabase, Firebase, atau database apapun
- ✅ Tidak ada API calls ke backend
- ✅ Semua state management dengan React hooks
- ✅ Ready for demo & mockup review

---

## 📱 UI Preview - Kedua Mode User

### Mode 1: PELANGGAN (Consumer)
**Email:** pelanggan@halo.com | **Password:** password123

#### Tabs yang Tersedia:
1. **🏠 Beranda** - Homepage dengan banner, product categories, expert highlights, articles
2. **🛒 Belanja** - Product marketplace dengan filter, search, detail modal, add to cart
3. **💬 Konsultasi** - Cari ahli konsultasi, riwayat sesi, chat simulation, payment modal
4. **📚 Artikel** - List artikel pertanian, search filter, artikel detail modal
5. **👤 Profil** - User profile, settings, role switcher (untuk testing), logout

**Header:** Search bar + shopping cart dengan badge (untuk tab Beranda)

---

### Mode 2: AHLI (Expert)
**Email:** ahli@halo.com | **Password:** password123

#### Tabs yang Tersedia:
1. **💬 Konsultasi** - Daftar expert (versi ahli melihat konsultasi mereka), riwayat sesi, chat interface
2. **📚 Artikel** - List artikel untuk edit/manage (bisa demo nanti), detail view
3. **👤 Profil** - Profile ahli, expert info, role switcher, logout

**Header:** Expert header dengan nama + avatar (tidak ada search/cart)

**Pembedaan Utama:**
- Tab Beranda & Belanja TIDAK DITAMPILKAN
- Header berbeda (expert-specific)
- Navigasi bottom nav hanya 3 tab

---

## 🎨 Visual Design Features

### Color Palette:
- **Primary Green:** #16a34a (untuk buttons, accents, highlight)
- **Gray Neutral:** #f3f4f6, #e5e7eb, #9ca3af (backgrounds, borders, text)
- **Status Colors:** 
  - 🟢 Active/Online: Green
  - 🟠 Pending: Orange
  - 🔵 Paid/Ready: Blue
  - ⚫ Completed/Inactive: Gray

### Typography:
- **Headings:** Bold/Extra Bold, tracking-tight untuk visual hierarchy
- **Body:** Regular weight, readable line-height
- **Labels:** All caps, ultra-small, untuk status badges

### Components & Features:
- ✅ Smooth animations (fade-in, slide-in, transitions)
- ✅ Modal dialogs (konsultasi, pembayaran, artikel detail, produk detail)
- ✅ Cards dengan shadows dan borders
- ✅ Responsive design (mobile-first, tested up to desktop)
- ✅ Interactive buttons dengan hover/active states
- ✅ Bottom navigation (sticky)
- ✅ Search & filter functionality
- ✅ Status badges dengan icons

---

## 🧪 Testing Scenarios

### Scenario 1: Login & Browse Pelanggan
1. Buka aplikasi
2. Klik tombol **"👥 Pelanggan"** (auto-fill email)
3. Klik **"Masuk"**
4. Lihat Homepage dengan 5 tabs di bawah
5. Explore: Beranda → Belanja → Konsultasi → Artikel → Profil

**Expected:** Semua tab aktif, header dengan search/cart, produk & article bisa dilihat dengan modal

### Scenario 2: Login & Browse Ahli
1. Buka aplikasi
2. Klik tombol **"👨‍🌾 Ahli"** (auto-fill email)
3. Klik **"Masuk"**
4. Langsung masuk ke tab **Konsultasi** (tidak ada Beranda/Belanja)
5. Explore: Konsultasi → Artikel → Profil

**Expected:** Hanya 3 tabs terlihat, header custom ahli, tidak bisa akses shop/home

### Scenario 3: Role Switching
1. Login sebagai Pelanggan
2. Buka tab **Profil**
3. Klik **"Ubah Role ke Ahli"** (atau sebaliknya)
4. Lihat perubahan langsung: tabs berubah, header berubah, view update

**Expected:** Transisi mulus, navigasi otomatis ke tab yang valid

### Scenario 4: Modal Interactions
1. **Konsultasi Tab:**
   - Klik "Cari Ahli" → lihat daftar ahli dengan online status
   - Klik ahli → profile modal/konsultasi modal
   - Di "Sesi Saya" → lihat riwayat dengan status
   - Klik "Bayar Sesi" → payment modal
   - Klik "Masuk Chat" → chat room interface

2. **Belanja Tab (Pelanggan only):**
   - Scroll product list → klik produk → detail modal
   - Klik "Masukkan Keranjang" → item ditambah ke cart
   - Header cart badge update

3. **Artikel Tab:**
   - Search/filter artikel
   - Klik artikel → full article detail modal dengan markdown

---

## 📊 Data Used

### Dummy Data Sources (No Backend):
- `src/data/dummyData.ts` - Semua mock data tersimpan di sini:
  - Products (bunga, pupuk, benih, alat)
  - Experts (dokter hewan, agronomist, veterinarian)
  - Articles (markdown format)
  - Consultation history

### State Management:
- **React Hooks:** useState untuk local state
- **Context API:** AppContext untuk global user role
- **No API Calls:** Semua data dari dummyData.ts

---

## ✅ Checklist Review

### Functionality:
- [x] Dual-role login working (Pelanggan & Ahli)
- [x] Demo mode buttons auto-fill credentials
- [x] Role-based navigation tabs correct
- [x] Expert mode blocks access to shop/home
- [x] Role switching in profile works
- [x] All modals open/close properly
- [x] Search & filter working
- [x] Responsive design on mobile

### Design:
- [x] Color scheme consistent
- [x] Typography hierarchy clear
- [x] Spacing & padding consistent
- [x] Icons meaningful & appropriate
- [x] Animations smooth & non-jarring
- [x] Status badges clear & readable
- [x] Mobile layout clean & usable

### No Backend/Database:
- [x] No Supabase imports
- [x] No Firebase integration
- [x] No API calls (fetch/axios)
- [x] No environment variables needed
- [x] Package.json cleaned (removed @supabase)
- [x] All data from mock/dummy files
- [x] Works offline (no network needed)

---

## 🚀 How to Review

1. **Start App:** Run `npm run dev`
2. **Login Modes:** Try both demo buttons
3. **Navigate:** Test all tabs for both roles
4. **Interact:** Click modals, forms, buttons
5. **Visual Check:** Review colors, spacing, typography
6. **Mobile Test:** Resize browser / test on mobile device
7. **Switch Roles:** Test role switching from profile

---

## 📝 File Structure (Key Files)

```
src/
├── App.tsx                              # Main app component
├── pages/
│   └── Index.tsx                        # Router setup
├── components/
│   ├── AppLayout.tsx                    # Main layout with routing
│   ├── halotrubus/
│   │   ├── HomeView.tsx                # Homepage
│   │   ├── ShopView.tsx                # Product marketplace
│   │   ├── ConsultView.tsx             # Consultation interface
│   │   ├── ArticlesView.tsx            # Articles list
│   │   ├── ProfileView.tsx             # User profile
│   │   ├── Header.tsx                  # Consumer header
│   │   ├── ExpertHeader.tsx            # Expert header (NEW)
│   │   ├── BottomNav.tsx               # Role-based navigation
│   │   ├── AuthModal.tsx               # Login with demo buttons
│   │   ├── ProductCard.tsx             # Product card component
│   │   ├── ExpertCard.tsx              # Expert card component
│   │   └── [Other modals & components]
│   └── ui/                              # Shadcn UI components
├── contexts/
│   └── AppContext.tsx                  # Global role state
├── data/
│   └── dummyData.ts                    # All mock data
└── styles/
    └── index.css                       # Global styles

No backend files / API handlers needed!
```

---

## 🎓 What to Look For During Review

1. **UX Flow:** Can users intuitively navigate? Is dual-role clear?
2. **Visual Polish:** Are colors, spacing, typography cohesive?
3. **Responsiveness:** Does it work on mobile/tablet/desktop?
4. **Interactions:** Are buttons, modals, forms responsive & smooth?
5. **Data Display:** Is product/article/expert info clear & readable?
6. **Status Indicators:** Are consultation statuses (pending/active/paid) obvious?
7. **Role Separation:** Can expert user NOT see shop items? ✅
8. **Demo Readiness:** Can you quickly test both roles without manual input?

---

## 📞 Support

Semua fitur adalah **frontend-only mockup** untuk review UI/UX.
Tidak ada backend, tidak ada database, tidak ada external dependencies.

Aplikasi siap untuk **visual review, mockup presentation, dan design feedback**! 🎉
