# 🎬 START VIEWING - Getting Started Guide

## Quick Start (60 seconds)

### Step 1: Run the App
```bash
npm run dev
```

The app will start on `http://localhost:5173` (or your configured port)

---

## 🎯 What to Expect

### Landing Screen
You'll see a **login modal** with:
- Halo Trubus logo
- Two big demo buttons:
  - **👥 Pelanggan** - Click to try customer experience
  - **👨‍🌾 Ahli** - Click to try expert experience
- Email & password fields (auto-filled when you click demo buttons)
- "Masuk" (Login) button

---

## 🧪 Test Scenario 1: Customer Mode (5 minutes)

### Step 1: Login
1. Click **"👥 Pelanggan"** button
2. Email field becomes: `pelanggan@halo.com`
3. Password field becomes: `password123`
4. Click **"Masuk"** button

### Step 2: Explore Tabs (Bottom Navigation)
You'll see 5 tabs at the bottom:

#### Tab 1: 🏠 Beranda (Home)
- Hero banner with featured products
- Product categories (horizontal scroll)
- Featured experts section
- Latest articles

**Try:** Scroll around, look at the layout and design

#### Tab 2: 🛒 Belanja (Shop)
- Search bar to find products
- Filter by category
- Product grid/list
- Click any product → Detail modal opens

**Try:** 
- Search for "tomat" atau "pupuk"
- Click product card
- Read product details in modal
- Click "Masukkan Keranjang" → adds to cart
- See cart badge update on header

#### Tab 3: 💬 Konsultasi (Consultation)
- Two sub-tabs: "Cari Ahli" & "Sesi Saya"
- **Cari Ahli:** List of agriculture experts with online status
- **Sesi Saya:** Your consultation history with statuses

**Try:**
- View expert list (see online/offline status via colors)
- Click expert → consultation options
- Go to "Sesi Saya" tab
- Click items with different statuses:
  - Orange "Bayar Sesi" → payment modal
  - Green "Masuk Chat" → chat room interface

#### Tab 4: 📚 Artikel (Articles)
- Search & filter articles
- Article cards with cover images
- Click article → full detail modal with content

**Try:**
- Search for "pertanian" atau "organik"
- Click article card
- See full article in modal

#### Tab 5: 👤 Profil (Profile)
- User information
- Settings options
- **Role Switch Button** ← Important for testing!
- Logout button

**Try:**
- Click "Ubah Role ke Ahli" button
- Watch everything change instantly

---

## 🧪 Test Scenario 2: Expert Mode (5 minutes)

### Step 1: Login as Expert
1. Go back to login (click logout from profile)
2. Click **"👨‍🌾 Ahli"** button
3. Email: `ahli@halo.com`
4. Password: `password123`
5. Click **"Masuk"**

### What's Different?

#### Visible Changes:
- ✅ Only **3 tabs** at bottom (no 🏠 Beranda, no 🛒 Belanja)
- ✅ **Header changes** - Shows expert name + avatar instead of search/cart
- ✅ Starts on **Konsultasi** tab (not Beranda)

#### Tab 1: 💬 Konsultasi (Consultation)
- Same features as customer but in expert context
- See consultation requests / history

**Try:**
- Switch between "Cari Ahli" (view experts) & "Sesi Saya" (your sessions)
- Open payment/chat modals

#### Tab 2: 📚 Artikel (Articles)
- Same article list as customer view

**Try:**
- Read articles (same functionality)

#### Tab 3: 👤 Profil (Profile)
- Expert profile info
- Role switcher

**Try:**
- Click "Ubah Role ke Pelanggan" 
- Watch transition back to 5 tabs
- Notice header changes back to search/cart

---

## 🎨 Visual Design Review Points

### Color Scheme
- **Green (#16a34a):** Primary action buttons, highlights, active states
- **Gray:** Neutral backgrounds, text, borders
- **Orange:** Warnings, pending status, need-action items
- **Blue:** Information, secondary actions

### Typography
- Large, bold headings for hierarchy
- Clear readable body text
- Small uppercase labels for status badges

### Spacing & Layout
- Consistent padding/margins
- Cards with subtle shadows
- Rounded corners (2xl = 1rem radius)
- Mobile-first responsive design

### Interactive Elements
- Smooth transitions & animations
- Clear hover states
- Obvious clickable elements
- Modal overlays with blur background

---

## 🧪 Key Interactions to Test

### 1. Product Flow
```
Pelanggan Mode → Belanja Tab → Click Product → See Detail Modal
├─ Product name, image, description
├─ Price display
├─ Button to add to cart
└─ Success feedback
```

### 2. Consultation Flow
```
→ Konsultasi Tab → "Cari Ahli" → Click Expert → Modal Opens
├─ Expert info & rating
├─ Consultation details
└─ Action button (Book/Continue)
```

### 3. Payment Flow
```
→ Konsultasi Tab → "Sesi Saya" → Pending Item → Click "Bayar"
├─ Payment modal opens
├─ Shows expert name & price
└─ "Bayar Sekarang" button
```

### 4. Chat Flow
```
→ Konsultasi Tab → "Sesi Saya" → Active/Paid Item → Click Button
├─ Chat interface opens fullscreen
├─ Shows expert info at top
├─ Mock chat messages
└─ Message input at bottom
```

### 5. Article Reading
```
→ Artikel Tab → Click Article Card → Detail Modal
├─ Full article content
├─ Formatted text
└─ Author & date info
```

### 6. Role Switching
```
→ Profil Tab → Click Role Button
├─ Role changes instantly
├─ Navigation tabs update
├─ Header changes
└─ No page reload
```

---

## 📱 Responsive Design

### Test on Different Sizes:

**Mobile (375px - 425px)**
- Tabs still visible at bottom
- Content scales down
- Touch-friendly button sizes
- Modals responsive

**Tablet (768px - 1024px)**
- Layout expands
- Cards display better
- Still mobile-optimized

**Desktop (1200px+)**
- Max width constraint (mobile-first design)
- All features visible

**How to test:**
1. Open DevTools (F12)
2. Toggle device toolbar
3. Try different device sizes

---

## 🎬 Complete Demo Flow (10 minutes)

```
1. Start App [1 min]
   └─ See login screen

2. Customer Mode [4 min]
   ├─ Login as pelanggan@halo.com
   ├─ Explore Beranda (home)
   ├─ Try shopping (search, click, add to cart)
   ├─ View consultation interface
   ├─ Read articles
   └─ Check profile

3. Switch to Expert Mode [2 min]
   ├─ From profile tab, click role button
   ├─ See instant UI change
   ├─ Notice 3 tabs instead of 5
   ├─ Notice header changed
   └─ Explore expert view

4. Test Key Interactions [3 min]
   ├─ Try a modal (product detail, payment)
   ├─ Test search/filter
   ├─ Check animations
   └─ Verify responsiveness

5. Visual Review [Final]
   ├─ Color consistency
   ├─ Typography hierarchy
   ├─ Spacing uniformity
   ├─ Button interaction feedback
   └─ Overall aesthetic
```

---

## 🚀 What's Ready to Review

### ✅ Fully Functional:
- [x] Dual-role login with demo buttons
- [x] 5 tabs for customer, 3 tabs for expert
- [x] All modals (product, article, consultation, payment, chat)
- [x] Search & filter functionality
- [x] Role switching
- [x] Responsive design
- [x] Smooth animations

### ✅ No Backend Needed:
- [x] All data is mock data (dummyData.ts)
- [x] No API calls
- [x] No database
- [x] No Supabase/Firebase
- [x] Works completely offline

### ✅ Design Polish:
- [x] Consistent color scheme
- [x] Professional typography
- [x] Clean spacing & layout
- [x] Clear visual hierarchy
- [x] Smooth interactions

---

## 📝 Notes for Reviewer

1. **Demo Buttons:** The big colorful buttons in login are for quick testing - super useful!

2. **Mock Data:** All products, experts, articles are dummy data from `src/data/dummyData.ts`

3. **No Backend:** This is pure frontend for mockup/review purposes

4. **Role Testing:** The role switcher in Profile tab is perfect for testing both UX flows

5. **Responsive:** Works on mobile, tablet, desktop - test in different window sizes

6. **Performance:** Should load instantly (no API calls, no network requests)

---

## 🎯 During Your Review

Take note of:
- Does the dual-role separation make sense?
- Is the navigation intuitive?
- Do the colors/typography feel cohesive?
- Are buttons and interactions responsive?
- Is the customer experience different from expert?
- Would you make any UI changes?
- Is the design professional/polished?

---

## 📞 Questions?

Everything is **self-contained in this repo**:
- No setup needed (except `npm run dev`)
- No environment variables
- No external services
- Just pure React + Tailwind + Shadcn UI

**Enjoy the review!** 🎉
