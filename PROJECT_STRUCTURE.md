# 📁 Project Structure - Halo Trubus App

Panduan lengkap struktur project dan navigasi file.

---

## 🏗️ Project Layout

```
agricultureconsultarticles/
│
├── 📄 ROOT FILES (Config & Docs)
│   ├── vite.config.ts                    (Vite bundler config)
│   ├── tailwind.config.ts                (Tailwind CSS config)
│   ├── tsconfig.json                     (TypeScript config)
│   ├── package.json                      (Dependencies)
│   ├── index.html                        (HTML entry point)
│   │
│   └── 📚 DOCUMENTATION (Generated untuk project ini)
│       ├── QUICK_START.md                (Testing guide - BACA INI DULU!)
│       ├── IMPLEMENTATION_SUMMARY.md     (Technical details)
│       ├── FLOW_DIAGRAM.md               (Visual architecture)
│       ├── ROLE_GUIDE.md                 (Features per role)
│       ├── IMPLEMENTATION_COMPLETE.md    (Status report)
│       └── PROJECT_STRUCTURE.md          (File ini)
│
├── 📁 src/
│   │
│   ├── 📄 main.tsx                       (App entry point)
│   ├── 📄 App.tsx                        (Root component)
│   ├── 📄 App.css                        (Global styles)
│   ├── 📄 index.css                      (Tailwind directives)
│   │
│   ├── 📁 contexts/
│   │   └── AppContext.tsx                ⭐ [MODIFIED] Role state management
│   │
│   ├── 📁 pages/
│   │   ├── Index.tsx                     (Main app wrapper)
│   │   └── NotFound.tsx                  (404 page)
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📄 AppLayout.tsx              ⭐ [MODIFIED] Main routing & layout
│   │   ├── 📄 theme-provider.tsx         (Theme management)
│   │   │
│   │   ├── 📁 ui/                        (shadcn UI components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── ... (40+ UI components)
│   │   │
│   │   └── 📁 halotrubus/                (Custom app components)
│   │       │
│   │       ├── 📄 Header.tsx             (Consumer header)
│   │       ├── 📄 ExpertHeader.tsx       ⭐ [NEW] Expert header
│   │       ├── 📄 BottomNav.tsx          ⭐ [MODIFIED] Role-based nav
│   │       │
│   │       ├── 📁 Views/
│   │       │   ├── HomeView.tsx          (Consumer home)
│   │       │   ├── ShopView.tsx          (Product catalog)
│   │       │   ├── ConsultView.tsx       (Consultations)
│   │       │   ├── ArticlesView.tsx      (Articles/Blog)
│   │       │   └── ProfileView.tsx       (User profile)
│   │       │
│   │       ├── 📁 Modals/
│   │       │   ├── AuthModal.tsx         ⭐ [MODIFIED] Login with demo mode
│   │       │   ├── ProductDetailModal.tsx
│   │       │   ├── ConsultationModal.tsx
│   │       │   ├── ArticleDetailModal.tsx
│   │       │   ├── CartModal.tsx
│   │       │   └── SuccessModal.tsx
│   │       │
│   │       └── 📁 Cards/
│   │           ├── ArticleCard.tsx
│   │           ├── ProductCard.tsx
│   │           └── ExpertCard.tsx
│   │
│   ├── 📁 hooks/
│   │   ├── use-mobile.tsx                (Mobile detection)
│   │   └── use-toast.ts                  (Toast notifications)
│   │
│   ├── 📁 lib/
│   │   └── utils.ts                      (Utility functions)
│   │
│   └── 📁 data/
│       └── dummyData.ts                  (Mock data)
│
├── 📁 public/
│   └── robots.txt
│
└── 📁 components.json                    (shadcn config)
```

---

## 🎯 Key Files untuk Dual-Role Implementation

### Core Files (Harus Ada):

| File | Role | Status |
|------|------|--------|
| `src/contexts/AppContext.tsx` | State management | ⭐ MODIFIED |
| `src/components/AppLayout.tsx` | Main routing | ⭐ MODIFIED |
| `src/components/halotrubus/AuthModal.tsx` | Demo login | ⭐ MODIFIED |
| `src/components/halotrubus/BottomNav.tsx` | Navigation | ⭐ MODIFIED |
| `src/components/halotrubus/ExpertHeader.tsx` | Expert UI | ✨ NEW |

### Unchanged (Still Working):
- `src/components/halotrubus/ConsultView.tsx` - Works for both roles
- `src/components/halotrubus/ArticlesView.tsx` - Works for both roles
- `src/components/halotrubus/ProfileView.tsx` - Has role switcher
- All UI components - No changes needed

---

## 📍 File Navigation Guide

### Ingin Modify:
- **Navigation?** → Edit `/src/components/halotrubus/BottomNav.tsx`
- **Login Flow?** → Edit `/src/components/halotrubus/AuthModal.tsx`
- **Header?** → Edit `/src/components/halotrubus/Header.tsx` (consumer) atau `ExpertHeader.tsx` (expert)
- **Role Logic?** → Edit `/src/components/AppLayout.tsx`
- **State?** → Edit `/src/contexts/AppContext.tsx`

### Ingin Add Fitur Baru:
1. Consumer-only feature → Add di HomeView atau ShopView
2. Expert-only feature → Add di new component + import ke AppLayout
3. Both roles → Add di existing views (ConsultView, ArticlesView)

### Ingin Debug:
- **Role tidak berubah?** → Check `AppContext` state
- **Tab tidak muncul?** → Check `BottomNav` filtering logic
- **Header wrong?** → Check `AppLayout` header condition
- **Login email tidak terisi?** → Check `AuthModal` button handler

---

## 🔧 Development Workflow

### 1. Making Changes
```
1. Edit file yang sesuai (lihat table di atas)
2. Changes auto-save
3. App auto-refresh
4. Test di browser
```

### 2. Testing Changes
```
1. Buka QUICK_START.md
2. Follow testing scenarios
3. Verify behavior matches expectations
4. Check both consumer & expert modes
```

### 3. Adding New Features
```
1. Identify role(s) yang butuh feature
2. Create new component di halotrubus/
3. Add to AppLayout renderContent()
4. Update BottomNav if new tab
5. Test di both modes
```

---

## 📊 Component Dependency Map

```
App.tsx
  ↓
AppLayout.tsx (Main Container)
  ├─ AuthModal.tsx
  │  └─ Demo buttons + Form
  │
  ├─ Header.tsx (Consumer only)
  │  └─ Logo, Search, Cart, Bell
  │
  ├─ ExpertHeader.tsx (Expert only)
  │  └─ Logo, Name, Avatar
  │
  ├─ HomeView.tsx (Consumer only)
  │  ├─ ArticleCard.tsx
  │  ├─ ProductCard.tsx
  │  └─ ExpertCard.tsx
  │
  ├─ ShopView.tsx (Consumer only)
  │  └─ ProductCard.tsx
  │     └─ ProductDetailModal.tsx
  │
  ├─ ConsultView.tsx (Both roles)
  │  ├─ ExpertCard.tsx
  │  └─ ConsultationModal.tsx
  │
  ├─ ArticlesView.tsx (Both roles)
  │  └─ ArticleCard.tsx
  │     └─ ArticleDetailModal.tsx
  │
  ├─ ProfileView.tsx (Both roles)
  │  └─ Role switcher toggle
  │
  ├─ CartModal.tsx (Consumer only)
  │  └─ Product management
  │
  └─ BottomNav.tsx
     └─ Dynamic tabs (5 or 3)

AppContext.tsx
  └─ Provides userRole state
```

---

## 🚀 Quick File Lookup

### Mau cari file?

**By Feature:**
- Konsultasi → `ConsultView.tsx`
- Belanja/Produk → `ShopView.tsx`, `ProductCard.tsx`
- Artikel → `ArticlesView.tsx`, `ArticleCard.tsx`
- Profile → `ProfileView.tsx`
- Navigation → `BottomNav.tsx`, `Header.tsx`, `ExpertHeader.tsx`

**By Type:**
- Modals → `src/components/halotrubus/*Modal.tsx`
- Cards → `src/components/halotrubus/*Card.tsx`
- Views → `src/components/halotrubus/*View.tsx`
- UI Components → `src/components/ui/*.tsx`

**By Role Impact:**
- Expert only → `ExpertHeader.tsx`
- Consumer only → `Header.tsx`, `HomeView.tsx`, `ShopView.tsx`
- Both roles → `ConsultView.tsx`, `ArticlesView.tsx`, `ProfileView.tsx`

---

## 💾 Data Flow

### State Management:
```
AppContext
  ├─ userRole: 'consumer' | 'expert'
  ├─ setUserRole: function
  └─ (passed to AppLayout via useContext)

AppLayout
  ├─ activeTab: string
  ├─ userData: UserData | null
  ├─ isLoggedIn: boolean
  └─ (local state, doesn't use context)
```

### Props Flow:
```
AppLayout
  ↓
BottomNav ← userRole (determines tabs)
  ↓
Header/ExpertHeader ← userData (shows user info)
  ↓
Views ← userRole (for filtering)
```

---

## 🎨 Styling Guide

### Colors:
- Primary: Green (`green-500`, `green-600`)
- Neutral: Gray (`gray-50` to `gray-900`)
- Accent: Blue, Purple, Orange (untuk status)
- Danger: Red (`red-500`)
- Success: Green (`green-500`)

### Spacing:
- Use Tailwind scale: `p-4`, `m-2`, `gap-3`, etc.
- Consistent padding: `px-6 py-3` standard

### Typography:
- Headings: `font-black`, `text-2xl`
- Body: `text-sm`, `font-medium`
- Labels: `text-xs`, `font-bold`, `uppercase`

---

## 📈 Performance Notes

- ✅ Component memoization for expensive renders
- ✅ useCallback for handler optimization
- ✅ Conditional rendering untuk hide unused components
- ✅ Lazy loading bisa ditambah di future

---

## 🔗 External Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "react-query": "^3.0.0",
    "lucide-react": "^latest",
    "radix-ui": "^latest",
    "tailwindcss": "^3.0.0",
    "typescript": "^4.0.0"
  }
}
```

---

## 🧪 Testing Files

Dokumentasi untuk testing:
- `QUICK_START.md` - Langkah testing
- `FLOW_DIAGRAM.md` - Visual flow untuk verify
- Tidak ada unit test files (dapat ditambah di future)

---

## 📝 Summary

- ✅ Clear file organization
- ✅ Easy to locate features
- ✅ Well-documented components
- ✅ Scalable architecture
- ✅ Ready untuk expansion

**Project structure siap untuk development dan expansion!** 🚀
