import React, { useState } from 'react';
import { 
  User, Settings, ShoppingBag, MessageCircle, Heart, 
  CreditCard, Bell, HelpCircle, LogOut, ChevronRight,
  Edit2, LogIn, ShieldCheck, FileText, Wallet, ArrowLeft,
  LucideIcon, Star, Ticket
} from 'lucide-react';

// --- DATA DUMMY ---
const ORDER_HISTORY_DUMMY = [
  { id: 'TRX-2024-001', date: '02 Feb 2024', status: 'Selesai', total: 245000, items: 'Pupuk NPK Booster + 2 Bibit Jeruk', image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=200' },
  { id: 'TRX-2024-002', date: '28 Jan 2024', status: 'Dikirim', total: 120000, items: 'Sekop Taman Ergonomis', image: 'https://images.unsplash.com/photo-1617576641088-e02d7f50f584?w=200' },
  { id: 'TRX-2024-003', date: '15 Jan 2024', status: 'Selesai', total: 540000, items: 'Sistem Irigasi Tetes Otomatis', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200' },
  { id: 'TRX-2024-004', date: '10 Jan 2024', status: 'Dibatalkan', total: 85000, items: 'Bibit Cabai Rawit Merah', image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=200' },
  { id: 'TRX-2024-005', date: '02 Jan 2024', status: 'Selesai', total: 175000, items: 'Pot Tanaman Keramik Minimalis', image: 'https://images.unsplash.com/photo-1485841890310-6a055c88698a?w=200' }
];

// --- INTERFACES ---
interface MenuItem {
  icon: LucideIcon;
  label: string;
  badge?: string;
  color: string;
  bg: string;
  action?: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'consumer' | 'expert';
  avatar: string;
  isVerified: boolean;
  points: number; // Menambahkan informasi poin
}

interface ProfileViewProps {
  userRole: 'consumer' | 'expert';
  onRoleChange: (role: 'consumer' | 'expert') => void;
  isLoggedIn: boolean;
  userData: UserData | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  userRole, 
  onRoleChange, 
  isLoggedIn, 
  userData, 
  onLoginClick,
  onLogout 
}) => {
  const [currentView, setCurrentView] = useState<'profile' | 'orders'>('profile');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const consumerMenuItems: MenuItem[] = [
    { 
      icon: ShoppingBag, 
      label: 'Pesanan Saya', 
      badge: '2', 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      action: () => setCurrentView('orders')
    },
    { icon: MessageCircle, label: 'Riwayat Konsultasi', badge: '3', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Ticket, label: 'Voucher Saya', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Heart, label: 'Produk Favorit', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: CreditCard, label: 'Metode Pembayaran', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const expertMenuItems: MenuItem[] = [
    { icon: MessageCircle, label: 'Sesi Konsultasi', badge: '5', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: FileText, label: 'Artikel Saya', badge: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Wallet, label: 'Dompet & Pendapatan', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const generalMenuItems: MenuItem[] = [
    { icon: Bell, label: 'Notifikasi', color: 'text-gray-400', bg: 'bg-gray-50' },
    { icon: Settings, label: 'Pengaturan', color: 'text-gray-400', bg: 'bg-gray-50' },
    { icon: HelpCircle, label: 'Pusat Bantuan', color: 'text-gray-400', bg: 'bg-gray-50' },
  ];

  if (currentView === 'orders') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-in slide-in-from-right duration-300">
        <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b">
          <button onClick={() => setCurrentView('profile')} className="p-3 bg-gray-50 rounded-2xl active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Riwayat Pesanan</h2>
        </div>
        <div className="p-6 space-y-4">
          {ORDER_HISTORY_DUMMY.map((order) => (
            <div key={order.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex gap-4">
              <img src={order.image} alt="product" className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-gray-400 uppercase">{order.id}</p>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                    order.status === 'Selesai' ? 'bg-green-50 text-green-600' : 
                    order.status === 'Dibatalkan' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>{order.status}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{order.items}</h4>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{order.date}</p>
                    <p className="text-sm font-black text-green-600">{formatCurrency(order.total)}</p>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 underline">Detail</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

 if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="bg-white px-8 pt-20 pb-12 rounded-b-[4rem] shadow-sm relative overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 z-0" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-16 -mb-16 z-0" />
          
          <div className="relative z-10 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200 rotate-3">
              <User size={56} className="text-white" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
              Mulai Perjalanan <br/> Pertanian Anda
            </h1>
            <p className="text-gray-500 text-sm mb-10 font-medium max-w-[240px] mx-auto leading-relaxed">
              Bergabunglah dengan komunitas petani modern dan akses ribuan solusi pertanian.
            </p>
            
            <button 
              onClick={onLoginClick} 
              className="w-full py-5 bg-green-500 text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-3"
            >
              <LogIn size={18} /> Masuk ke Akun
            </button>
            
            <p className="mt-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Belum punya akun? <span className="text-green-600 underline">Daftar Sekarang</span>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="p-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2 text-center">
            Mengapa Bergabung?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
               <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag size={24}/>
               </div>
               <h4 className="font-black text-gray-800 text-[11px] uppercase tracking-tight mb-1">Belanja Tani</h4>
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Akses produk original & berkualitas</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
               <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle size={24}/>
               </div>
               <h4 className="font-black text-gray-800 text-[11px] uppercase tracking-tight mb-1">Tanya Ahli</h4>
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Konsultasi masalah lahan secara privat</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
               <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                <Star size={24}/>
               </div>
               <h4 className="font-black text-gray-800 text-[11px] uppercase tracking-tight mb-1">TaniPoints</h4>
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Kumpulkan poin & klaim voucher</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
               <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24}/>
               </div>
               <h4 className="font-black text-gray-800 text-[11px] uppercase tracking-tight mb-1">Terverifikasi</h4>
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Komunitas aman & terpercaya</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-10 text-center mt-4">
          <p className="text-[10px] text-gray-300 font-medium leading-loose">
            Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Saya</h1>
            <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-green-500 transition-colors"><Settings size={20} /></button>
          </div>
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <img 
                src={userData?.avatar || (userRole === 'consumer' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200')} 
                alt="Profile" className="w-20 h-20 rounded-[2rem] object-cover ring-4 ring-gray-50 shadow-md" 
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-xl flex items-center justify-center shadow-lg"><Edit2 size={12} className="text-white" /></button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-black text-xl text-gray-900 leading-tight">{userData?.name || (userRole === 'consumer' ? 'Budi Santoso' : 'Dr. Bambang S.')}</h2>
                {userData?.isVerified !== false && <ShieldCheck size={18} className="text-blue-500" />}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{userRole === 'consumer' ? 'Petani Milenial' : 'Spesialis Hidroponik'}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-1.5 rounded-[1.5rem] flex">
            <button onClick={() => onRoleChange('consumer')} className={`flex-1 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all ${userRole === 'consumer' ? 'bg-white text-green-600 shadow-md' : 'text-gray-400'}`}>Konsumen</button>
            <button onClick={() => onRoleChange('expert')} className={`flex-1 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all ${userRole === 'expert' ? 'bg-white text-green-600 shadow-md' : 'text-gray-400'}`}>Ahli</button>
          </div>
        </div>
      </div>

      {/* Stats Section with Point Information */}
      <div className="px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-6 flex justify-between border border-gray-50">
          <div className="text-center flex-1">
            <p className="text-lg font-black text-green-600">
              {userRole === 'consumer' ? (userData?.points?.toLocaleString() || '1.250') : '2.4k'}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {userRole === 'consumer' ? 'TaniPoints' : 'Sesi'}
            </p>
          </div>
          <div className="w-px bg-gray-100 mx-2" />
          <div className="text-center flex-1">
            <p className="text-lg font-black text-gray-900">{userRole === 'consumer' ? '5' : '12'}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{userRole === 'consumer' ? 'Order' : 'Artikel'}</p>
          </div>
          <div className="w-px bg-gray-100 mx-2" />
          <div className="text-center flex-1">
            <p className="text-lg font-black text-gray-900">{userRole === 'consumer' ? '28' : '4.9'}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{userRole === 'consumer' ? 'Simpan' : 'Rating'}</p>
          </div>
        </div>
      </div>

      {/* Point Banner - Only for Consumer */}
      {userRole === 'consumer' && (
        <div className="px-6 mt-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-[2.2rem] p-5 flex items-center justify-between shadow-lg shadow-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-4">
              <Star size={100} fill="white" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-wider">Loyalty Rewards</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-xl font-black">{userData?.points?.toLocaleString() || '1.250'}</span>
                  <span className="text-white/70 text-[10px] font-bold uppercase">Points</span>
                </div>
              </div>
            </div>
            <button className="bg-white text-green-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all relative z-10">
              Tukar
            </button>
          </div>
        </div>
      )}

      {/* Menu List */}
      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Aktivitas Saya</h3>
          <div className="bg-white rounded-[2.2rem] shadow-sm overflow-hidden border border-gray-100">
            {(userRole === 'consumer' ? consumerMenuItems : expertMenuItems).map((item, index, arr) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.action && item.action()}
                  className={`w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-all active:scale-[0.98] ${index !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-sm`}><Icon size={22} /></div>
                  <span className="flex-1 text-left font-extrabold text-gray-700 text-sm">{item.label}</span>
                  {item.badge && <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-red-100">{item.badge}</span>}
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Dukungan</h3>
          <div className="bg-white rounded-[2.2rem] shadow-sm overflow-hidden border border-gray-100">
            {generalMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={`w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-all ${index !== generalMenuItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}><Icon size={22} /></div>
                  <span className="flex-1 text-left font-extrabold text-gray-700 text-sm">{item.label}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 rounded-[2rem] font-black uppercase text-xs tracking-widest border border-red-100/50 active:scale-95 transition-transform">
          <LogOut size={18} /> Keluar Akun
        </button>
      </div>
    </div>
  );
};

export default ProfileView;