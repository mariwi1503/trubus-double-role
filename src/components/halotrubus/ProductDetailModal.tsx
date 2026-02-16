
import React, { useState } from 'react';
import { X, Star, Plus, Minus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product, formatPrice } from '@/data/dummyData';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

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

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[100vw] sm:max-w-2xl p-0 gap-0 overflow-hidden sm:rounded-3xl h-[100vh] sm:h-[90vh] flex flex-col">
        {/* Floating Header Actions */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between pointer-events-none">
          <DialogClose asChild>
            <Button size="icon" variant="secondary" className="pointer-events-auto rounded-full shadow-lg h-10 w-10 bg-white/80 backdrop-blur-xl hover:bg-white text-foreground">
              <X size={20} />
            </Button>
          </DialogClose>
          <div className="flex gap-2 pointer-events-auto">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg h-10 w-10 bg-white/80 backdrop-blur-xl hover:bg-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground'} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg h-10 w-10 bg-white/80 backdrop-blur-xl hover:bg-white"
            >
              <Share2 size={20} className="text-foreground" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 -mr-0">
          <div className="relative h-[45vh] bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />

            {product.originalPrice && (
              <div className="absolute bottom-6 left-6">
                <Badge variant="destructive" className="px-3 py-1 text-xs uppercase tracking-widest shadow-lg">
                  Hemat {formatPrice(product.originalPrice - product.price)}
                </Badge>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 pt-2">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <DialogTitle className="text-2xl font-black leading-tight mb-2">{product.name}</DialogTitle>
                  <DialogDescription className="sr-only">Detail produk {product.name}</DialogDescription>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-2xl font-black text-primary tracking-tight">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm font-bold text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-border/50">
                <div className="flex items-center gap-2 shrink-0">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-foreground">{product.rating}</span>
                  <span className="text-xs font-bold text-muted-foreground">(Ulasan)</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col shrink-0">
                  <span className="font-bold text-foreground">{product.sold}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Terjual</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col shrink-0">
                  <span className="font-bold text-foreground">{product.stock}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Stok</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, label: 'Gratis Ongkir', class: 'text-blue-500 bg-blue-50' },
                { icon: Shield, label: 'Garansi Resmi', class: 'text-green-500 bg-green-50' },
                { icon: RotateCcw, label: '7 Hari Retur', class: 'text-orange-500 bg-orange-50' },
              ].map((badge, idx) => (
                <Card key={idx} className={`shadow-none border-none ${badge.class}`}>
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <badge.icon size={24} className="mb-2" />
                    <span className="text-[10px] font-black text-foreground/80 uppercase leading-tight">{badge.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Deskripsi Produk</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">{product.description}</p>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 bg-background border-t flex items-center gap-4 z-20">
          <div className="flex items-center gap-2 bg-muted rounded-full p-1 border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center font-black text-lg">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              <Plus size={16} />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            size="lg"
            className="flex-1 rounded-full uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-3"
          >
            <ShoppingCart size={18} />
            <span>+ Keranjang</span>
            <span className="w-1 h-1 bg-primary-foreground/30 rounded-full" />
            <span>{formatPrice(product.price * quantity)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
