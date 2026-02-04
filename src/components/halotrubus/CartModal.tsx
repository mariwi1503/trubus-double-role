'use client';

import React, { useState } from 'react';
import { 
  X, Plus, Minus, Trash2, ShoppingBag, MapPin, 
  CreditCard, ChevronRight, ArrowLeft, CheckCircle2, 
  Truck, ShieldCheck, Landmark, Smartphone, Banknote
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

type CheckoutStep = 'cart' | 'checkout' | 'success';

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState('va');

  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = 15000;

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('cart'), 300);
  };

  const handleFinalCheckout = () => {
    setStep('success');
    setTimeout(() => {
        onClearCart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-900" />
              </button>
            )}
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {step === 'cart' ? 'Keranjang' : step === 'checkout' ? 'Checkout' : 'Berhasil'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 bg-gray-50 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {step === 'cart' && (
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-gray-200" />
                  </div>
                  <p className="font-black text-gray-900">Keranjang Kosong</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white border border-gray-100 rounded-3xl p-3 shadow-sm">
                    <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-gray-800 line-clamp-1">{item.product.name}</h3>
                      <p className="text-green-600 font-black text-sm">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus size={14}/></button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus size={14}/></button>
                        </div>
                        <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-red-400"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {step === 'checkout' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Alamat Pengiriman</h3>
                <div className="flex items-start gap-4 p-4 bg-green-50/50 border border-green-100 rounded-[1.5rem]">
                  <div className="p-2 bg-white rounded-xl text-green-600 shadow-sm"><MapPin size={20}/></div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">Rumah Utama (Budi)</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">Jl. Tani Mulya No. 45, Lembang, Bandung Barat, Jawa Barat 40391</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Metode Pembayaran</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'va', name: 'Transfer', icon: Landmark },
                    { id: 'qris', name: 'QRIS', icon: Smartphone },
                    { id: 'cod', name: 'COD', icon: Banknote },
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${selectedPayment === method.id ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}
                    >
                      <method.icon size={20} className={selectedPayment === method.id ? 'text-green-600' : 'text-gray-400'}/>
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{method.name}</span>
                    </button>
                  ))}
                </div>
                {selectedPayment === 'cod' && (
                  <p className="mt-3 px-4 py-2 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg flex items-center gap-2">
                    <Truck size={14} /> Bayar tunai saat kurir sampai di tujuan.
                  </p>
                )}
              </section>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-50">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Pesanan berhasil dibuat</h2>
              <p className="text-sm text-gray-400 font-medium px-10">
                {selectedPayment === 'cod' 
                  ? "Pesanan COD Anda sedang kami siapkan untuk dikirim." 
                  : "Silahkan lakukan pembayaran sesuai detail pesanan anda"}
              </p>
              <button onClick={handleClose} className="mt-8 px-8 py-3 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Tutup</button>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                <span className="font-black text-gray-900">Total Tagihan</span>
                <span className="text-2xl font-black text-green-600">
                  {formatPrice(step === 'cart' ? totalPrice : totalPrice + shippingFee)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => step === 'cart' ? setStep('checkout') : handleFinalCheckout()}
              className="w-full py-5 bg-green-500 text-white font-black uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-3"
            >
              {step === 'cart' ? (
                <>Lanjut Checkout <ChevronRight size={20}/></>
              ) : (
                <><ShieldCheck size={20}/> Konfirmasi</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;