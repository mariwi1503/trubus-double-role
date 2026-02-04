# Flow Diagram - Role-Based Application

## 🔐 Login Flow

```
┌─────────────────────────┐
│   Buka Aplikasi         │
│                         │
│   (AuthModal tertutup)   │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────────┐
    │  Klik "Masuk"      │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────────────────────┐
    │   Modal Login Terbuka              │
    │                                    │
    │   ┌──────────────┐  ┌──────────┐  │
    │   │ 👥 Pelanggan │  │👨‍🌾 Ahli  │  │
    │   │ Mode Demo    │  │Mode Demo │  │
    │   └──────────────┘  └──────────┘  │
    │                                    │
    │   - Pilih salah satu              │
    │   - Email auto-fill               │
    │   - Password auto-fill            │
    └────────┬─────────────────────┬────┘
             │                     │
             ▼                     ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ pelanggan@...   │   │ ahli@halo.com    │
    │ password123     │   │ password123      │
    └────────┬────────┘   └────────┬─────────┘
             │                     │
             ▼                     ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Klik "Masuk"    │   │ Klik "Masuk"     │
    └────────┬────────┘   └────────┬─────────┘
             │                     │
             ▼                     ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Role: Consumer  │   │ Role: Expert     │
    │ Name: Budi      │   │ Name: Dr. Siti   │
    └────────┬────────┘   └────────┬─────────┘
             │                     │
             ▼                     ▼
    ┌─────────────────┐   ┌──────────────────┐
    │  Ke Tab HOME    │   │ Ke Tab KONSULTASI│
    └─────────────────┘   └──────────────────┘
```

---

## 📱 UI Layout Perbedaan

### CONSUMER VIEW (Pelanggan)

```
┌─────────────────────────────┐
│ 🏠 Halo Trubus  🔔   🛒 (2) │  ← Header Consumer
│                             │
│ Search Bar: "Cari bibit..." │
├─────────────────────────────┤
│                             │
│        Content Area         │
│                             │
│    (HomeView, ShopView,     │
│    ConsultView, Articles)   │
│                             │
├─────────────────────────────┤
│ 🏠  🛒  💬  📚  👤        │  ← 5 Tabs Navigation
│ HOME SHOP CONSULT ARTICLE   │
└─────────────────────────────┘

Default Starting Tab: HOME (Beranda)
```

### EXPERT VIEW (Ahli)

```
┌─────────────────────────────┐
│ 🏠 Halo Trubus   Dr. Siti 👤 │  ← Header Expert
│                             │
│    (No search, no cart)     │
├─────────────────────────────┤
│                             │
│        Content Area         │
│                             │
│    (ConsultView, Articles,  │
│    ProfileView ONLY)        │
│                             │
├─────────────────────────────┤
│ 💬  📚  👤                 │  ← 3 Tabs Navigation
│ CONSULT ARTICLE PROFILE     │
└─────────────────────────────┘

Default Starting Tab: CONSULT (Konsultasi)
```

---

## 🔄 Role Switching Flow

```
┌─────────────────────────────┐
│   User Login (Role: Consumer)│
└────────────┬────────────────┘
             │
             ▼
     ┌───────────────┐
     │  UI Beranda   │  ← 5 Tabs visible
     └───────┬───────┘
             │
             ▼ (Klik tab Profil)
     ┌──────────────────┐
     │  Profile View    │
     │                  │
     │ ┌──────────────┐ │
     │ │ Konsumen ✓   │ │  ← Toggle Role
     │ │  Ahli        │ │
     │ └──────────────┘ │
     └───────┬──────────┘
             │
             ▼ (Klik tombol "Ahli")
     ┌──────────────────┐
     │ Role Changed:    │  ← State Updated
     │ Consumer → Expert│
     └───────┬──────────┘
             │
             ▼
     ┌──────────────────┐
     │ Tab Check:       │
     │ - Beranda? X     │  ← Invalid for Expert
     │ - Belanja? X     │  ← Invalid for Expert
     │ - Konsultasi? ✓  │  ← Valid, switch to this
     └───────┬──────────┘
             │
             ▼
     ┌──────────────────┐
     │ UI Konsultasi    │  ← 3 Tabs visible
     │                  │  │
     │ 💬 📚 👤        │  │ Expert tabs only
     │                  │  │
     └──────────────────┘
```

---

## 📊 Component Relationship

```
AppLayout (Main Container)
│
├─ AuthModal
│  └─ Demo Mode Selection (👥 Pelanggan | 👨‍🌾 Ahli)
│
├─ Header (IF: Consumer & activeTab = 'home')
��  └─ Logo, Search, Cart, Notifications
│
├─ ExpertHeader (IF: Expert & activeTab ≠ 'profile')
│  └─ Logo, User Name, Avatar
│
├─ Main Content (renderContent)
│  │
│  └─ Consumer Access:
│     ├─ HomeView
│     ├─ ShopView
│     ├─ ConsultView
│     ├─ ArticlesView
│     └─ ProfileView
│
│  └─ Expert Access:
│     ├─ ConsultView (with history)
│     ├─ ArticlesView
│     └─ ProfileView
│
└─ BottomNav
   └─ Dynamic Tabs (5 for Consumer, 3 for Expert)

AppContext
├─ userRole: 'consumer' | 'expert'
├─ setUserRole: (role) => void
└─ (Other global states)
```

---

## 🔀 Routing Rules

### Consumer (Pelanggan)
- Dapat akses: `home`, `shop`, `consult`, `articles`, `profile`
- Header: Consumer Header (search + cart)
- Tabs: 5 tabs

### Expert (Ahli)
- Dapat akses: `consult`, `articles`, `profile`
- Tidak bisa akses: `home`, `shop` (auto-redirect ke `consult`)
- Header: Expert Header (user info)
- Tabs: 3 tabs

### Protection Logic
```typescript
if (userRole === 'expert' && ['home', 'shop'].includes(activeTab)) {
  setActiveTab('consult'); // Force redirect
}
```

---

## 🎯 Key Features

### 1. Smart Tab Filtering
```
Consumer BottomNav:
[Beranda] [Belanja] [Konsultasi] [Artikel] [Profil]

Expert BottomNav:
[Konsultasi] [Artikel] [Profil]
```

### 2. Automatic Role Detection
```typescript
if (email.includes('ahli')) {
  role = 'expert'
  name = 'Dr. Siti Nurhaliza'
} else {
  role = 'consumer'
  name = 'Budi Santoso'
}
```

### 3. Context-Aware Headers
```
Consumer:  [Logo] [Bell] [Cart(2)]
Expert:    [Logo] [Name] [Avatar]
```

### 4. Role Switching in Profile
```
Profil View (untuk kedua role):
┌─────────────────────┐
│  Profile Header     │
│                     │
│ [Konsumen] [Ahli]  │  ← Toggle
│  ✓        (click)   │
└─────────────────────┘
```

---

## ✨ User Experience Flow

```
CONSUMER USER:
  Login → Home → Browse Products → Check Experts → 
  Start Consultation → Profile → Purchase History → Favorites

EXPERT USER:
  Login → Consultation Sessions → Chat with Customers →
  Write Articles → Edit Articles → View Earnings → Profile
```

---

## 🧪 Testing Checklist

- [ ] Login dengan Mode Pelanggan
- [ ] Login dengan Mode Ahli
- [ ] Verify header berubah
- [ ] Verify tabs berubah
- [ ] Test role switching di Profil
- [ ] Test tab protection (ahli tidak bisa akses Belanja)
- [ ] Test navigation tidak error
- [ ] Verify user data terupdate dengan benar
- [ ] Test mobile responsiveness

---

**Semua flow sudah implementasi dan siap untuk testing!** 🚀
