'use client';

import React, { useState } from 'react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MapPin,
  ChevronRight, ArrowLeft, CheckCircle2,
  Truck, ShieldCheck, Lock, Copy, AlertCircle, Package
} from 'lucide-react';
import { CartItem, formatPrice, couriers, Courier, Product } from '@/data/dummyData';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProductClick: (product: Product) => void;
}

type CheckoutStep = 'cart' | 'address' | 'courier' | 'payment' | 'instruction' | 'success';

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProductClick
}) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState('bca');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const addresses = [
    { id: 1, label: 'Rumah Utama', name: 'Budi Hartono', detail: 'Jl. Tani Mulya No. 45, Lembang, Bandung Barat, Jawa Barat 40391', phone: '081234567890' },
    { id: 2, label: 'Kantor (Pusat)', name: 'Budi Hartono', detail: 'Menara Mandiri Lt. 12, Sudirman Kav 54, Jakarta Selatan, DKI Jakarta 12190', phone: '081234567890' },
    { id: 3, label: 'Rumah Orang Tua', name: 'Ibu Siti', detail: 'Gg. Melati No. 12, Purwakarta, Jawa Barat 41118', phone: '081987654321' }
  ];

  const paymentDetails: Record<string, any> = {
    bca: { name: 'BCA Virtual Account', number: '1668176888', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg', cat: 'Transfer' },
    gopay: { name: 'GoPay', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', cat: 'E-Wallet' },
    ovo: { name: 'OVO', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', cat: 'E-Wallet' }
  };

  const productTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = selectedCourier ? selectedCourier.price : 0;
  const grandTotal = productTotal + shippingCost;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('cart');
      setSelectedCourier(null);
    }, 300);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNext = () => {
    if (step === 'cart') setStep('address');
    else if (step === 'address') setStep('courier');
    else if (step === 'courier' && selectedCourier) setStep('payment');
    else if (step === 'payment') setStep('instruction');
    else if (step === 'instruction') setStep('success');
  };

  const handleBack = () => {
    if (step === 'address') setStep('cart');
    else if (step === 'courier') setStep('address');
    else if (step === 'payment') setStep('courier');
    else if (step === 'instruction') setStep('payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">

        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-6 pt-8 border-b border-gray-50 bg-white z-10">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors active:scale-95">
                <ArrowLeft size={22} className="text-gray-900" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                {step === 'cart' ? 'Keranjang Belanja' :
                  step === 'address' ? 'Alamat Pengiriman' :
                    step === 'courier' ? 'Pilih Pengiriman' :
                      step === 'payment' ? 'Metode Pembayaran' :
                        step === 'instruction' ? 'Selesaikan Pembayaran' : ''}
              </h2>
              {step !== 'success' && step !== 'cart' && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Langkah {step === 'address' ? '1' : step === 'courier' ? '2' : step === 'payment' ? '3' : '4'} dari 4
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors active:scale-90">
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
                className="mt-8 px-8 py-3.5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all hover:bg-green-600"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CART LIST */}
              {step === 'cart' && (
                <div className="space-y-4 pb-20">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-white border border-gray-100 rounded-[2rem] p-3 shadow-sm hover:shadow-md transition-all group">
                      <div
                        className="relative w-20 h-20 shrink-0 cursor-pointer"
                        onClick={() => onProductClick(item.product)}
                      >
                        <img src={item.product.image} className="w-full h-full rounded-[1.5rem] object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <h3
                            className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors cursor-pointer"
                            onClick={() => onProductClick(item.product)}
                          >
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">{item.product.category}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-green-600 font-black text-sm">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-90 transition-transform"><Minus size={14} /></button>
                              <span className="w-8 text-center text-xs font-black text-gray-900">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-90 transition-transform"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors active:scale-90"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: ADDRESS SELECTION */}
              {step === 'address' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  {addresses.map((addr, idx) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(idx)}
                      className={`w-full flex items-start gap-4 p-5 rounded-[2.5rem] border-2 transition-all text-left relative group ${selectedAddress === idx ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white hover:border-gray-200'
                        }`}
                    >
                      <div className={`p-3 rounded-2xl shadow-sm border shrink-0 transition-colors ${selectedAddress === idx ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-100'}`}>
                        <MapPin size={22} className={selectedAddress === idx ? 'fill-current' : ''} />
                      </div>
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-gray-900 text-sm">{addr.label}</span>
                          {idx === 0 && <span className="text-[9px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Utama</span>}
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">{addr.name} <span className="text-gray-400 font-normal">({addr.phone})</span></p>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{addr.detail}</p>
                      </div>
                      {selectedAddress === idx && (
                        <div className="absolute top-5 right-5 text-green-500">
                          <CheckCircle2 size={24} className="fill-green-100" />
                        </div>
                      )}
                    </button>
                  ))}
                  <button className="w-full py-4 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <Plus size={18} /> Tambah Alamat Baru
                  </button>
                </div>
              )}

              {/* STEP 3: COURIER SELECTION */}
              {step === 'courier' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  {couriers.map((courier) => (
                    <button
                      key={courier.id}
                      onClick={() => setSelectedCourier(courier)}
                      className={`w-full flex items-center justify-between p-4 rounded-[2rem] border-2 transition-all ${selectedCourier?.id === courier.id ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white hover:border-gray-200'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                          <img src={courier.logo} alt={courier.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-black text-gray-900 text-sm">{courier.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Estimasi {courier.etd}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-green-600 text-sm">{formatPrice(courier.price)}</p>
                        {selectedCourier?.id === courier.id && (
                          <div className="flex justify-end mt-1 text-green-500">
                            <CheckCircle2 size={16} className="fill-green-100" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4: PAYMENT OPTIONS */}
              {step === 'payment' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
                  {/* Summary Card */}
                  <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Lock size={100} /></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                    <h3 className="text-3xl font-black tracking-tighter mb-4">{formatPrice(grandTotal)}</h3>

                    <div className="flex items-center justify-between text-xs py-2 border-t border-gray-800 text-gray-400">
                      <span>Total Harga ({cartItems.length} barang)</span>
                      <span>{formatPrice(productTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-t border-gray-800 text-gray-400">
                      <span>Total Ongkos Kirim</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Metode Pembayaran</p>
                    {Object.entries(paymentDetails).map(([id, detail]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedPayment(id)}
                        className={`w-full flex items-center justify-between p-4 rounded-[2rem] border-2 transition-all ${selectedPayment === id ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white hover:border-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                            <img src={detail.icon} alt={detail.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-gray-900 text-sm">{detail.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{detail.cat}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPayment === id ? 'bg-green-500 border-green-500' : 'border-gray-200'}`}>
                          {selectedPayment === id && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT INSTRUCTION */}
              {step === 'instruction' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Virtual Account</div>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <h4 className="text-3xl font-black text-gray-900 tracking-wider font-mono">{paymentDetails[selectedPayment].number}</h4>
                      <button onClick={() => copyToClipboard(paymentDetails[selectedPayment].number)} className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 text-blue-600 transition-colors active:scale-90">
                        {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                      <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-black text-amber-800 text-sm mb-1">Menunggu Pembayaran</h5>
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        Selesaikan pembayaran Anda sebelum <span className="font-bold">23:59 WIB</span> hari ini agar pesanan tidak dibatalkan otomatis.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed">
                      <span className="text-xs font-bold text-gray-500 uppercase">Total Tagihan</span>
                      <span className="text-lg font-black text-green-600">{formatPrice(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500 uppercase">Metode</span>
                      <div className="flex items-center gap-2">
                        <img src={paymentDetails[selectedPayment].icon} className="h-4" />
                        <span className="text-xs font-bold text-gray-900">{paymentDetails[selectedPayment].name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: SUCCESS */}
              {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500 h-full">
                  <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200 animate-bounce">
                    <CheckCircle2 size={64} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Pesanan Berhasil!</h2>
                  <p className="text-gray-400 font-medium px-8 leading-relaxed mb-12">
                    Terima kasih telah berbelanja di Halo Trubus.<br />
                    Produk Anda akan segera kami proses.
                  </p>

                  <div className="w-full space-y-3">
                    <button
                      onClick={() => {
                        handleClose();
                        onClearCart();
                      }}
                      className="w-full py-4 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
                    >
                      Kembali ke Beranda
                    </button>
                    <button className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600">
                      Lihat Riwayat Pesanan
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- FOOTER ACTION --- */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="p-6 border-t border-gray-50 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            {step === 'cart' && (
              <div className="flex justify-between items-end mb-6 px-1">
                <div>
                  <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest mb-1">Total Harga</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatPrice(productTotal)}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={step === 'courier' && !selectedCourier}
              className={`w-full py-5 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95
                ${(step === 'courier' && !selectedCourier)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-green-500 shadow-green-100 hover:bg-green-600'}`
              }
            >
              {step === 'cart' ? 'Checkout' :
                step === 'address' ? 'Pilih Pengiriman' :
                  step === 'courier' ? 'Lanjut Pembayaran' :
                    step === 'payment' ? 'Konfirmasi Pesanan' : 'Saya Sudah Bayar'}
              <ChevronRight size={18} />
            </button>
            {step === 'payment' && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                <Lock size={12} /> Pembayaran Aman & Terenkripsi
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;