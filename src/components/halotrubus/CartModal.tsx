'use client';

import React, { useState } from 'react';
import { 
  X, Plus, Minus, Trash2, ShoppingBag, MapPin, 
  ChevronRight, ArrowLeft, CheckCircle2, 
  Truck, ShieldCheck, Lock, Copy, AlertCircle
} from 'lucide-react';
import { CartItem, formatPrice } from '@/data/dummyData';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'instruction' | 'success';

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState('bca');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const addresses = [
    { id: 1, label: 'Rumah Utama', name: 'Budi Hartono', detail: 'Jl. Tani Mulya No. 45, Lembang, Bandung Barat, Jawa Barat 40391' },
    { id: 2, label: 'Kantor (Pusat)', name: 'Budi Hartono', detail: 'Menara Mandiri Lt. 12, Sudirman Kav 54, Jakarta Selatan, DKI Jakarta 12190' },
    { id: 3, label: 'Rumah Orang Tua', name: 'Ibu Siti', detail: 'Gg. Melati No. 12, Purwakarta, Jawa Barat 41118' }
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = 15000;
  const grandTotal = totalPrice + shippingFee;

  const paymentDetails: Record<string, any> = {
    bca: { name: 'BCA Virtual Account', number: '1668176888', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg', cat: 'Transfer' },
    gopay: { name: 'GoPay', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', cat: 'E-Wallet' },
    ovo: { name: 'OVO', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', cat: 'E-Wallet' }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('cart'), 300);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal Container dengan Border Radius 2.5rem - 3rem */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-6 pt-8 border-b border-gray-50 bg-white">
          <div className="flex items-center gap-3">
            {['checkout', 'payment', 'instruction'].includes(step) && (
              <button onClick={() => setStep(step === 'instruction' ? 'payment' : step === 'payment' ? 'checkout' : 'cart')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                <ArrowLeft size={22} className="text-gray-900" />
              </button>
            )}
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {step === 'cart' ? 'Keranjang' : step === 'checkout' ? 'Pilih Alamat' : step === 'payment' ? 'Pembayaran' : 'Instruksi Bayar'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-3 bg-gray-50 rounded-2xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* KONDISI CART KOSONG */}
          {step === 'cart' && cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <ShoppingBag size={40} className="text-gray-200" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Wah, Keranjangmu Kosong</h3>
              <p className="text-sm text-gray-400 mt-2 font-medium px-10">Yuk, isi keranjangmu dengan produk-produk terbaik kami!</p>
              <button 
                onClick={handleClose}
                className="mt-8 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: DAFTAR BARANG */}
              {step === 'cart' && (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-white border border-gray-100 rounded-[2rem] p-3 shadow-sm hover:shadow-md transition-shadow">
                      <img src={item.product.image} className="w-20 h-20 rounded-[1.5rem] object-cover" />
                      <div className="flex-1">
                        <h3 className="text-sm font-black text-gray-800 line-clamp-1">{item.product.name}</h3>
                        <p className="text-green-600 font-black text-sm">{formatPrice(item.product.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                          </div>
                          <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: ALAMAT */}
              {step === 'checkout' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  {addresses.map((addr, idx) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(idx)}
                      className={`w-full flex items-start gap-4 p-5 rounded-[2.5rem] border-2 transition-all text-left ${
                        selectedAddress === idx ? 'border-green-500 bg-green-50/30 shadow-lg shadow-green-50' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                      }`}
                    >
                      <div className={`p-2.5 rounded-2xl shadow-sm border ${selectedAddress === idx ? 'bg-white text-green-600 border-green-100' : 'bg-white text-gray-400 border-gray-100'}`}>
                        <MapPin size={22}/>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900 text-sm">{addr.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1 font-medium">{addr.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 3: PEMBAYARAN */}
              {step === 'payment' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300 ">
                  <div className="rounded-[2.5rem] p-6 text-green-500 shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</p>
                    <h3 className="text-3xl font-black text-green-500 tracking-tighter mt-1">{formatPrice(grandTotal)}</h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(paymentDetails).map(([id, detail]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedPayment(id)}
                        className={`w-full flex items-center justify-between p-4 rounded-[2rem] border-2 transition-all ${
                          selectedPayment === id ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm">
                            <img src={detail.icon} alt={detail.name} className="max-h-full object-contain" />
                          </div>
                          <p className="text-sm font-black text-gray-800 leading-none">{detail.name}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === id ? 'bg-green-500 border-green-500' : 'border-gray-100'}`}>
                          {selectedPayment === id && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: INSTRUKSI PEMBAYARAN */}
              {step === 'instruction' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 text-center space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No. Virtual Account</p>
                    <div className="flex items-center justify-center gap-3">
                      <h4 className="text-3xl font-black text-gray-900 tracking-wider">{paymentDetails[selectedPayment].number}</h4>
                      <button onClick={() => copyToClipboard(paymentDetails[selectedPayment].number)} className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 border border-gray-100">
                        {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-[1.5rem] border border-amber-100 text-amber-700">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-[10px] font-bold leading-tight uppercase">Selesaikan bayar agar pesanan tidak batal otomatis.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: SUCCESS (AKHIR) */}
              {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-50">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Selesai!</h2>
                  <p className="text-sm text-gray-400 font-medium px-10">Pesanan Anda berhasil dikirimkan. Cek status di Riwayat Pesanan.</p>
                  <button 
                    onClick={() => {
                      handleClose();
                      onClearCart(); 
                    }} 
                    className="mt-10 px-14 py-4 bg-green-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- FOOTER (Hanya tampil jika cart tidak kosong dan belum sukses) --- */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Total Tagihan</span>
              <span className="text-2xl font-black text-green-600 tracking-tighter">{formatPrice(grandTotal)}</span>
            </div>
            
            <button
              onClick={() => {
                if (step === 'cart') setStep('checkout');
                else if (step === 'checkout') setStep('payment');
                else if (step === 'payment') setStep('instruction');
                else if (step === 'instruction') setStep('success');
              }}
              className="w-full py-5 bg-green-500 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {step === 'cart' ? 'Checkout' : step === 'checkout' ? 'Lanjut Pembayaran' : step === 'payment' ? 'Konfirmasi Bayar' : 'Saya Sudah Bayar'}
              <ChevronRight size={18}/>
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <Lock size={12} /> Pembayaran Aman & Terenkripsi
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;