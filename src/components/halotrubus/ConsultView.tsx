'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, MessageSquare, Users, CreditCard, ChevronRight, 
  Calendar, CheckCircle, AlertCircle, ArrowLeft, Send, 
  ShieldCheck, Lock, Copy, Smartphone, Landmark
} from 'lucide-react';
import { Expert, experts, formatPrice } from '@/data/dummyData';
import ExpertCard from './ExpertCard';

// --- INTERFACES ---
interface ConsultViewProps { 
  onExpertClick: (expert: Expert) => void;
  userRole?: 'consumer' | 'expert';
}

interface ConsultationHistory {
  id: string;
  expertName: string;
  expertImage: string;
  date: string;
  status: 'pending' | 'paid' | 'active' | 'completed';
  price: number;
}

// --- DATA DUMMY ---
const dummyHistory: ConsultationHistory[] = [
  { id: '1', expertName: 'Dr. Ir. Budi Santoso', expertImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', date: '04 Feb 2026, 10:00', status: 'active', price: 50000 },
  { id: '2', expertName: 'Siti Aminah, M.P.', expertImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', date: '04 Feb 2026, 14:00', status: 'paid', price: 50000 },
  { id: '3', expertName: 'Rina Kartika, S.P.', expertImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', date: '05 Feb 2026, 11:00', status: 'pending', price: 75000 },
  { id: '4', expertName: 'Andi Wijaya, S.P.', expertImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', date: '30 Jan 2026, 09:00', status: 'completed', price: 50000 },
];

const ConsultView: React.FC<ConsultViewProps> = ({ onExpertClick, userRole = 'consumer' }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'experts'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  
  // States Modal & Navigasi
  const [showPayment, setShowPayment] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationHistory | null>(null);

  // States Simulasi Pembayaran
  const [paymentStep, setPaymentStep] = useState<'select' | 'detail'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | null>(null);

  const filteredExperts = useMemo(() => {
    let filtered = [...experts];
    if (searchQuery) filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered.sort((a, b) => (a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1));
  }, [searchQuery]);

  const getSessionConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return { label: 'Chat Sedang Berlangsung', btnLabel: 'Masuk Chat', text: 'text-green-600', bg: 'bg-green-50', icon: <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> };
      case 'paid': 
        return { label: 'Pembayaran Berhasil', btnLabel: 'Mulai Chat', text: 'text-blue-600', bg: 'bg-blue-50', icon: <CheckCircle size={14} /> };
      case 'pending': 
        return { label: 'Menunggu Pembayaran', btnLabel: 'Bayar Sesi', text: 'text-orange-600', bg: 'bg-orange-50', icon: <AlertCircle size={14} /> };
      default: 
        return { label: 'Sesi Selesai', btnLabel: 'Riwayat Chat', text: 'text-gray-500', bg: 'bg-gray-100', icon: <CheckCircle size={14} /> };
    }
  };

  const handleActionClick = (item: ConsultationHistory) => {
    setActiveConsultation(item);
    if (item.status === 'pending') {
      setPaymentStep('select');
      setShowPayment(true);
    } else {
      setShowChatRoom(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header Tab */}
      <div className="bg-white px-6 pt-8 pb-4 rounded-b-[2.5rem] shadow-sm sticky top-0 z-30">
        <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Konsultasi</h1>
        <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem]">
          <button onClick={() => setActiveTab('experts')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] text-sm font-bold transition-all ${activeTab === 'experts' ? 'bg-white text-green-600 shadow-md' : 'text-gray-500'}`}>
            <Users size={18} /> Cari Ahli
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.2rem] text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-green-600 shadow-md' : 'text-gray-500'}`}>
            <MessageSquare size={18} /> Sesi Saya
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'experts' ? (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 mb-4">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="Cari nama ahli..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent flex-1 outline-none text-sm font-medium" />
          </div>
          <div className="space-y-4">
            {filteredExperts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} onConsultClick={onExpertClick} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-5">
          {dummyHistory.map((item) => {
            const config = getSessionConfig(item.status);
            return (
              <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                <div className={`flex items-center gap-2 px-6 py-3 ${config.bg} ${config.text} text-[10px] font-black uppercase tracking-widest`}>
                  {config.icon} {config.label}
                </div>
                <div className="p-6">
                  <div className="flex gap-4 mb-5">
                    <img src={item.expertImage} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-gray-900 text-base">{item.expertName}</h4>
                      <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mt-1">
                        <Calendar size={13} /> {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Biaya</p>
                      <p className="text-base font-black text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => handleActionClick(item)}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 transition-all 
                        ${item.status === 'pending' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-green-600 text-white shadow-lg shadow-green-100'}`}
                    >
                      {item.status === 'pending' ? <CreditCard size={14} /> : null}
                      {config.btnLabel}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL CHAT ROOM --- */}
      {showChatRoom && activeConsultation && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b flex items-center gap-4 bg-white sticky top-0 shadow-sm">
            <button onClick={() => setShowChatRoom(false)} className="p-2 bg-gray-50 rounded-full"><ArrowLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <img src={activeConsultation.expertImage} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div>
                <h4 className="font-black text-gray-900 text-sm leading-tight">{activeConsultation.expertName}</h4>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Online</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-4">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
               <p className="text-sm text-gray-800 font-medium">Selamat datang! Silahkan deskripsikan permasalahan tanaman Anda, sertakan foto jika ada.</p>
               <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">10:05 AM</p>
             </div>
          </div>
          <div className="p-6 border-t bg-white">
            <div className="flex items-center gap-3 bg-gray-100 rounded-[1.5rem] px-5 py-2">
              <input type="text" placeholder="Tulis pesan..." className="bg-transparent flex-1 outline-none text-sm py-2" />
              <button className="bg-green-500 p-2.5 rounded-xl text-white shadow-lg shadow-green-100"><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PEMBAYARAN (SIMULASI) --- */}
      {showPayment && activeConsultation && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayment(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
            
            {/* Tombol Back di Step Detail */}
            {paymentStep === 'detail' && (
              <button onClick={() => setPaymentStep('select')} className="absolute top-8 left-8 p-2 bg-gray-50 rounded-full text-gray-400">
                <ArrowLeft size={20} />
              </button>
            )}

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                {paymentStep === 'select' ? 'Pilih Pembayaran' : 'Selesaikan Pembayaran'}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                Total Tagihan: <span className="text-green-600">{formatPrice(activeConsultation.price)}</span>
              </p>
            </div>

            {paymentStep === 'select' ? (
              <div className="space-y-3">
                <button onClick={() => { setSelectedMethod('qris'); setPaymentStep('detail'); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 hover:border-green-500 hover:bg-green-50 transition-all group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-white"><Smartphone className="text-orange-500" /></div>
                  <div className="text-left flex-1">
                    <p className="font-black text-gray-800 text-sm">QRIS (Otomatis)</p>
                    <p className="text-[10px] text-gray-400 font-bold">Gopay, OVO, ShopeePay, Dana</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>

                <button onClick={() => { setSelectedMethod('va'); setPaymentStep('detail'); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-50 hover:border-green-500 hover:bg-green-50 transition-all group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-white"><Landmark className="text-blue-500" /></div>
                  <div className="text-left flex-1">
                    <p className="font-black text-gray-800 text-sm">Transfer Virtual Account</p>
                    <p className="text-[10px] text-gray-400 font-bold">BCA, Mandiri, BNI, BRI</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              </div>
            ) : (
              /* --- DETAIL INSTRUKSI --- */
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {selectedMethod === 'qris' ? (
                  <div className="text-center">
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 mb-6">
                      <div className="bg-white p-3 rounded-2xl inline-block shadow-sm">
                        {/* Mock QR Code */}
                        <div className="w-40 h-40 bg-gray-900 rounded-lg flex flex-wrap p-2">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`w-8 h-8 border border-gray-800 ${i % 3 === 0 ? 'bg-white' : 'bg-gray-900'}`} />
                            ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-4">Scan QRIS Untuk Bayar</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Nomor Virtual Account</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl font-black text-blue-700 tracking-wider">8802 0812 3456</span>
                            <button className="p-2 bg-blue-100 rounded-lg text-blue-600 active:scale-90 transition-transform"><Copy size={16} /></button>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase">Nama Merchant</span><span className="text-xs font-black text-gray-800">HALO TRUBUS</span></div>
                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-400 uppercase">Batas Waktu</span><span className="text-xs font-black text-orange-600">23:59:59</span></div>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-green-500" /> Aman & Terverifikasi
                  </div>
                  <button 
                    onClick={() => setShowPayment(false)} 
                    className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 active:scale-95 transition-all"
                  >
                    Konfirmasi Pembayaran
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultView;