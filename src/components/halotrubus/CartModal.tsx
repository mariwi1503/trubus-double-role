'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MapPin,
  ChevronRight, ArrowLeft, CheckCircle2,
  Store, ShieldCheck, Lock, Copy, AlertCircle, Wallet
} from 'lucide-react';
import { useTrubusCoin } from '@/context/TrubusCoinContext';
import { useToast } from "@/components/ui/use-toast";
import { CartItem, formatPrice, couriers, Courier, Product, stores, Store as StoreType } from '@/data/dummyData';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProductClick: (product: Product) => void;
}

type CheckoutStep = 'cart' | 'address' | 'store' | 'courier' | 'confirmation' | 'payment' | 'instruction' | 'success';

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
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize defaults
  useEffect(() => {
    if (isOpen && !selectedStore && stores.length > 0) {
      setSelectedStore(stores[0]);
    }
  }, [isOpen]);

  // Addresses and Payment Data
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
    // Just close, do not reset flow so transaction can continue later
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const { balance, pay, formatCurrency } = useTrubusCoin();
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 'cart') setStep('address');
    else if (step === 'address') setStep('store');
    else if (step === 'store') setStep('courier');
    else if (step === 'courier' && selectedCourier) setStep('confirmation');
    else if (step === 'confirmation') setStep('payment');
    else if (step === 'payment') {
      if (selectedPayment === 'trubus_coin') {
        if (pay(grandTotal, `Pembelian ${cartItems.length} produk di Halo Trubus`)) {
          setStep('success');
        } else {
          toast({
            title: "Saldo Tidak Cukup",
            description: "Silahkan isi ulang Trubus Coin Anda atau pilih metode pembayaran lain.",
            variant: "destructive"
          });
        }
      } else {
        setStep('instruction');
      }
    }
    else if (step === 'instruction') setStep('success');
  };

  const handleBack = () => {
    if (step === 'address') setStep('cart');
    else if (step === 'store') setStep('address');
    else if (step === 'courier') setStep('store');
    else if (step === 'confirmation') setStep('courier');
    else if (step === 'payment') setStep('confirmation');
    else if (step === 'instruction') setStep('payment');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'cart': return 'Keranjang Belanja';
      case 'address': return 'Alamat Pengiriman';
      case 'store': return 'Pilih Toko Terdekat';
      case 'courier': return 'Pilih Pengiriman';
      case 'confirmation': return 'Konfirmasi Pesanan';
      case 'payment': return 'Metode Pembayaran';
      case 'instruction': return 'Selesaikan Pembayaran';
      case 'success': return 'Pesanan Berhasil';
      default: return '';
    }
  }

  // Animation progress bar width calculation
  const getProgressWidth = () => {
    switch (step) {
      case 'cart': return '15%';
      case 'address': return '30%';
      case 'store': return '45%';
      case 'courier': return '60%';
      case 'confirmation': return '75%';
      case 'payment': return '85%';
      case 'instruction': return '95%';
      case 'success': return '100%';
      default: return '0%';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">

        {/* Progress Bar */}
        {step !== 'success' && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-muted flex z-20">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: getProgressWidth() }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-8 border-b border-gray-50 bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                <ArrowLeft size={22} />
              </button>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {getStepTitle()}
              </h2>
              {step !== 'success' && step !== 'cart' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Langkah {step === 'address' ? '1' : step === 'store' ? '2' : step === 'courier' ? '3' : step === 'confirmation' ? '4' : step === 'payment' ? '5' : '6'} dari 6
                  </p>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-all text-muted-foreground hover:text-foreground group">
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 pb-24">
            {/* CART EMPTY */}
            {step === 'cart' && cartItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold">Wah, Keranjangmu Kosong</h3>
                <p className="text-sm text-muted-foreground mt-2 px-10">Yuk, isi keranjangmu dengan produk-produk terbaik kami!</p>
                <Button onClick={handleClose} className="mt-8 rounded-full uppercase font-bold tracking-widest">
                  Mulai Belanja
                </Button>
              </div>
            )}

            {/* STEP 1: CART LIST */}
            {step === 'cart' && cartItems.length > 0 && (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <Card key={item.product.id} className="border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-3 flex gap-4">
                      <div className="relative w-20 h-20 shrink-0 cursor-pointer overflow-hidden rounded-xl" onClick={() => onProductClick(item.product)}>
                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-bold line-clamp-1 cursor-pointer hover:text-primary transition-colors" onClick={() => onProductClick(item.product)}>{item.product.name}</h3>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">{item.product.category}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold text-sm">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}><Minus size={12} /></Button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}><Plus size={12} /></Button>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onRemoveItem(item.product.id)}><Trash2 size={16} /></Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {step === 'address' && (
              <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                {addresses.map((addr, idx) => (
                  <Card
                    key={addr.id}
                    onClick={() => setSelectedAddress(idx)}
                    className={`cursor-pointer transition-all border rounded-xl ${selectedAddress === idx ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  >
                    <CardContent className="p-4 flex gap-4 items-start relative">
                      <div className={`p-2 rounded-lg shrink-0 ${selectedAddress === idx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{addr.label}</span>
                          {idx === 0 && <Badge variant="default" className="text-[9px] px-1.5 py-0">Utama</Badge>}
                        </div>
                        <p className="text-sm font-semibold mb-1">{addr.name} <span className="text-muted-foreground font-normal">({addr.phone})</span></p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{addr.detail}</p>
                      </div>
                      {selectedAddress === idx && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={20} /></div>}
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full border-dashed rounded-xl py-6 h-auto">
                  <Plus size={16} className="mr-2" /> Tambah Alamat Baru
                </Button>
              </div>
            )}

            {/* STEP 3: STORE SELECTION */}
            {step === 'store' && (
              <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                {stores.map((store) => (
                  <Card
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`cursor-pointer transition-all border rounded-xl ${selectedStore?.id === store.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4 relative">
                      <div className={`p-2 rounded-lg shrink-0 ${selectedStore?.id === store.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Store size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{store.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{store.address}</p>
                        <Badge variant="secondary" className="mt-2 text-[10px] px-1.5 py-0 h-5">
                          Jarak: {store.distance}
                        </Badge>
                      </div>
                      {selectedStore?.id === store.id && <div className="absolute top-4 right-4 text-primary"><CheckCircle2 size={20} /></div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* STEP 4: COURIER */}
            {step === 'courier' && (
              <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                {couriers.map((courier) => (
                  <Card
                    key={courier.id}
                    onClick={() => setSelectedCourier(courier)}
                    className={`cursor-pointer transition-all border rounded-xl ${selectedCourier?.id === courier.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center p-2">
                          <img src={courier.logo} alt={courier.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{courier.name}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">Estimasi {courier.etd}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">{formatPrice(courier.price)}</p>
                        {selectedCourier?.id === courier.id && <CheckCircle2 size={16} className="text-primary ml-auto mt-1" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* STEP 5: CONFIRMATION (Summary) */}
            {step === 'confirmation' && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative rounded-xl shadow-lg">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Lock size={100} /></div>
                  <CardContent className="p-8 relative z-10 text-center">
                    <p className="text-[10px] font-bold text-primary-foreground/80 uppercase tracking-widest mb-2">Total Biaya</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6 text-primary-foreground">{formatPrice(grandTotal)}</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs py-2 border-t border-primary-foreground/20 text-primary-foreground/80">
                        <span>Total Barang ({cartItems.length})</span>
                        <span className="font-bold">{formatPrice(productTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 border-t border-primary-foreground/20 text-primary-foreground/80">
                        <span>Ongkos Kirim ({selectedCourier?.name})</span>
                        <span className="font-bold">{formatPrice(shippingCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <MapPin size={18} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-wider">Alamat Pengiriman</p>
                        <p className="text-sm font-bold text-gray-900">{addresses[selectedAddress].name}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{addresses[selectedAddress].detail}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Store size={18} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-wider">Toko Pengirim</p>
                        <p className="text-sm font-bold text-gray-900">{selectedStore?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedStore?.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 6: PAYMENT METHOD */}
            {step === 'payment' && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="space-y-3">
                  <p className="text-sm font-bold mb-4 text-gray-400 uppercase tracking-widest px-2">Pilih E-Wallet / Transfer</p>

                  {/* Trubus Coin Option */}
                  <Card
                    onClick={() => setSelectedPayment('trubus_coin')}
                    className={`cursor-pointer transition-all border rounded-xl ${selectedPayment === 'trubus_coin' ? 'border-emerald-500 bg-emerald-50/50' : 'hover:border-emerald-500/50'}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center p-2 shadow-sm text-emerald-600">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">Trubus Coin</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Saldo: {formatCurrency(balance)}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'trubus_coin' ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground/30'}`}>
                        {selectedPayment === 'trubus_coin' && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </CardContent>
                  </Card>

                  {Object.entries(paymentDetails).map(([id, detail]) => (
                    <Card
                      key={id}
                      onClick={() => setSelectedPayment(id)}
                      className={`cursor-pointer transition-all border rounded-xl ${selectedPayment === id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center p-2 shadow-sm">
                            <img src={detail.icon} alt={detail.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{detail.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{detail.cat}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === id ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                          {selectedPayment === id && <CheckCircle2 size={14} className="text-primary-foreground" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: INSTRUCTION */}
            {step === 'instruction' && (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                {selectedPayment === 'trubus_coin' ? (
                  // Is handled directly in handleNext, but if we land here for some reason
                  <div className="text-center py-10">Processing...</div>
                ) : (
                  <>
                    <div className="bg-muted/30 rounded-3xl p-8 border text-center space-y-4">
                      <div className="inline-block px-3 py-1 bg-white rounded-full border shadow-sm mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{paymentDetails[selectedPayment].name}</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <h4 className="text-3xl font-black tracking-wider font-mono text-foreground">{paymentDetails[selectedPayment].number}</h4>
                        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-white shadow-sm text-primary hover:text-primary hover:bg-muted" onClick={() => copyToClipboard(paymentDetails[selectedPayment].number)}>
                          {isCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Salin nomor di atas untuk melakukan pembayaran</p>
                    </div>

                    <div className="bg-accent/50 rounded-2xl p-6 border border-accent flex gap-4 text-accent-foreground">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle size={20} className="text-primary" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm mb-1 uppercase tracking-wider">Menunggu Pembayaran</h5>
                        <p className="text-xs font-medium leading-relaxed opacity-90">
                          Selesaikan pembayaran Anda sebesar <span className="font-black">{formatPrice(grandTotal)}</span> sebelum <span className="font-bold">23:59 WIB</span> hari ini.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 8: SUCCESS */}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 h-full">
                <div className="w-32 h-32 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Pesanan Berhasil!</h2>
                <p className="text-muted-foreground font-medium px-8 leading-relaxed mb-12">
                  Terima kasih telah berbelanja di Halo Trubus.<br />
                  Produk Anda akan segera kami proses.
                </p>
                <div className="w-full space-y-3 px-8">
                  <Button size="lg" className="w-full rounded-xl uppercase font-bold tracking-widest h-14" onClick={() => { onClose(); onClearCart(); setTimeout(() => setStep('cart'), 500); }}>
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="p-6 border-t bg-white sticky bottom-0 z-20 pb-8 sm:pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            {/* Total Price shown in Cart step */}
            {step === 'cart' && (
              <div className="flex justify-between items-end mb-4 px-1">
                <div>
                  <p className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Total Harga</p>
                  <p className="text-2xl font-black tracking-tighter text-foreground">{formatPrice(productTotal)}</p>
                </div>
              </div>
            )}

            <div className={`flex gap-3 ${step === 'instruction' ? 'flex-col-reverse' : ''}`}>
              {step === 'instruction' && (
                <Button
                  variant="outline"
                  className={`flex-1 h-14 rounded-xl font-bold uppercase tracking-widest text-xs border-2 ${step === 'instruction' ? 'w-full' : ''}`}
                  onClick={handleClose}
                >
                  Bayar Nanti
                </Button>
              )}

              <Button
                size="lg"
                className={`flex-1 h-14 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all ${step === 'instruction' ? 'w-full' : ''}`}
                onClick={handleNext}
                disabled={(step === 'courier' && !selectedCourier) || (step === 'store' && !selectedStore)}
              >
                {step === 'cart' ? 'Checkout' :
                  step === 'address' ? 'Lanjut Pilih Toko' :
                    step === 'store' ? 'Lanjut Pengiriman' :
                      step === 'courier' ? 'Lanjut Konfirmasi' :
                        step === 'confirmation' ? 'Pilih Pembayaran' :
                          step === 'payment' ? 'Bayar Sekarang' : 'Saya Sudah Bayar'}
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>

            {step === 'payment' && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-primary" /> Pembayaran Aman & Terverifikasi
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
};

export default CartModal;