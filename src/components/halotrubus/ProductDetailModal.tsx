import React, { useState } from 'react';
import { X, Star, Plus, Minus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product, formatPrice } from '@/data/dummyData';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[3rem] max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">

        {/* Floating Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-6 pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
          >
            <X size={24} className="text-gray-900" />
          </button>
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
            >
              <Heart size={24} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-900'} />
            </button>
            <button className="p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg hover:bg-white transition-all active:scale-90">
              <Share2 size={24} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-[45vh] shrink-0 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />

          {product.originalPrice && (
            <div className="absolute bottom-8 left-8">
              <span className="bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
                Hemat {formatPrice(product.originalPrice - product.price)}
              </span>
            </div>
          )}
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto -mt-6 relative z-10 px-8 pb-8">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-3xl font-black text-green-600 tracking-tight">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm font-bold text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 py-4 border-y border-gray-100 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">{product.rating}</span>
                <span className="text-xs font-bold text-gray-400">(Ulasan)</span>
              </div>
              <div className="w-px h-8 bg-gray-100 shrink-0" />
              <div className="flex flex-col shrink-0">
                <span className="font-bold text-gray-900">{product.sold}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Terjual</span>
              </div>
              <div className="w-px h-8 bg-gray-100 shrink-0" />
              <div className="flex flex-col shrink-0">
                <span className="font-bold text-gray-900">{product.stock}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Stok</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Truck, label: 'Gratis Ongkir', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Shield, label: 'Garansi Resmi', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: RotateCcw, label: '7 Hari Retur', color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((badge, idx) => (
              <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-3xl ${badge.bg} text-center`}>
                <badge.icon size={24} className={badge.color} />
                <span className="text-[10px] font-black text-gray-800 uppercase mt-2 leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-3">Deskripsi Produk</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{product.description}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-50 flex items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          {/* Quantity Control */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-[2rem] p-2 hover:bg-gray-200 transition-colors">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-900 hover:scale-110 transition-transform active:scale-90"
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center font-black text-lg text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-900 hover:scale-110 transition-transform active:scale-90"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95"
          >
            <ShoppingCart size={18} />
            <span>+ Keranjang</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>{formatPrice(product.price * quantity)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
