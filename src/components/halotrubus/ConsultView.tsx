
'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, MessageSquare, Users, CreditCard, ChevronRight,
  Calendar, CheckCircle, AlertCircle, ArrowLeft, Send,
  ShieldCheck, Lock, Copy, Smartphone, Landmark, Sparkles
} from 'lucide-react';
import { Expert, experts, formatPrice } from '@/data/dummyData';
import ExpertCard from './ExpertCard';
import ChatRoom from './ChatRoom';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [activeTab, setActiveTab] = useState('experts');
  const [searchQuery, setSearchQuery] = useState('');

  // States Modal & Navigasi
  const [showPayment, setShowPayment] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationHistory | null>(null);
  const [activeChatExpert, setActiveChatExpert] = useState<Expert | null>(null); // State for direct chat

  // States Simulasi Pembayaran
  const [paymentStep, setPaymentStep] = useState<'select' | 'detail'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | null>(null);

  // AI Logic
  const handleAiClick = () => {
    const aiExpert = experts.find(e => e.id === 'ai-bot');
    if (aiExpert) {
      setActiveChatExpert(aiExpert);
    }
  };

  const handleExpertCardClick = (expert: Expert) => {
    if (expert.isAi) {
      setActiveChatExpert(expert);
    } else {
      onExpertClick(expert);
    }
  };

  const filteredExperts = useMemo(() => {
    let filtered = [...experts];
    if (searchQuery) filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered.sort((a, b) => (a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1));
  }, [searchQuery]);

  const getSessionConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Chat Sedang Berlangsung', btnLabel: 'Masuk Chat', variant: 'default' as const, badgeVariant: 'default' as const, icon: <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping" /> };
      case 'paid':
        return { label: 'Pembayaran Berhasil', btnLabel: 'Mulai Chat', variant: 'default' as const, badgeVariant: 'secondary' as const, icon: <CheckCircle size={14} /> };
      case 'pending':
        return { label: 'Menunggu Pembayaran', btnLabel: 'Bayar Sesi', variant: 'destructive' as const, badgeVariant: 'destructive' as const, icon: <AlertCircle size={14} /> };
      default:
        return { label: 'Sesi Selesai', btnLabel: 'Riwayat Chat', variant: 'secondary' as const, badgeVariant: 'outline' as const, icon: <CheckCircle size={14} /> };
    }
  };

  const handleActionClick = (item: ConsultationHistory) => {
    setActiveConsultation(item);
    if (item.status === 'pending') {
      setPaymentStep('select');
      setShowPayment(true);
    } else {
      const expert = experts.find(e => e.name === item.expertName) || {
        id: 'temp',
        name: item.expertName,
        image: item.expertImage,
        specialization: 'Ahli Pertanian',
        experience: 10,
        rating: 4.8,
        consultations: 100,
        price: item.price,
        isOnline: true,
        bio: 'Ahli pertanian berpengalaman',
        education: 'S2 Pertanian'
      };
      setActiveChatExpert(expert);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      <div className="bg-card px-6 pt-8 pb-4 rounded-b-[2.5rem] shadow-sm sticky top-0 z-30">
        <h1 className="text-2xl font-black mb-6 tracking-tight">Konsultasi</h1>
        <Tabs defaultValue="experts" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-12 rounded-full p-1 bg-muted">
            <TabsTrigger value="experts" className="flex-1 rounded-full h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users size={16} className="mr-2" /> Cari Ahli
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 rounded-full h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MessageSquare size={16} className="mr-2" /> Sesi Saya
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-6">
        {activeTab === 'experts' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari nama ahli..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-background border-border/60"
              />
            </div>

            {/* AI Banner */}
            <Card
              onClick={handleAiClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
              <CardContent className="p-6 relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Tanya AI Sekarang</h3>
                  <p className="text-xs font-medium text-blue-100 opacity-90">Dapatkan jawaban instan.</p>
                </div>
                <Button size="sm" variant="secondary" className="ml-auto text-blue-600 text-[10px] font-bold uppercase">
                  Chat
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredExperts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} onConsultClick={handleExpertCardClick} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {dummyHistory.map((item) => {
              const config = getSessionConfig(item.status);
              return (
                <Card key={item.id} className="overflow-hidden border-border/50">
                  <div className="absolute top-0 right-0">
                    <Badge variant={config.badgeVariant} className="rounded-none rounded-bl-lg px-3 py-1 text-[10px] uppercase">
                      {config.label}
                    </Badge>
                  </div>
                  <CardContent className="p-4 pt-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl">
                        <AvatarImage src={item.expertImage} className="object-cover" />
                        <AvatarFallback className="rounded-2xl">{item.expertName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate pr-4">{item.expertName}</h4>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar size={12} /> {item.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-muted/20 flex items-center justify-between border-t border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {item.status === 'pending' ? 'Biaya Sesi' : 'Status'}
                    </p>
                    <Button
                      size="sm"
                      variant={config.variant}
                      onClick={() => handleActionClick(item)}
                      className="h-8 text-[10px] font-bold uppercase px-4 rounded-full"
                    >
                      {item.status === 'pending' && <CreditCard size={12} className="mr-1.5" />}
                      {config.btnLabel}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* --- PAYMENT DIALOG --- */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center items-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <DialogTitle>{paymentStep === 'select' ? 'Pilih Pembayaran' : 'Selesaikan Pembayaran'}</DialogTitle>
            <DialogDescription>
              Total Tagihan: <span className="font-bold text-primary">{activeConsultation && formatPrice(activeConsultation.price)}</span>
            </DialogDescription>
          </DialogHeader>

          {paymentStep === 'select' ? (
            <div className="grid gap-4 py-4">
              <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => { setSelectedMethod('qris'); setPaymentStep('detail'); }}>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4"><Smartphone className="text-orange-500" size={20} /></div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">QRIS (Otomatis)</div>
                  <div className="text-[10px] text-muted-foreground">Gopay, OVO, ShopeePay</div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => { setSelectedMethod('va'); setPaymentStep('detail'); }}>
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mr-4"><Landmark className="text-blue-500" size={20} /></div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">Virtual Account</div>
                  <div className="text-[10px] text-muted-foreground">BCA, Mandiri, BNI</div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4 animate-in fade-in zoom-in-95">
              {selectedMethod === 'qris' ? (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                    {/* Mock QR */}
                    <div className="w-48 h-48 bg-gray-900 grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                      {[...Array(36)].map((_, i) => (
                        <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Scan QRIS untuk bayar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="p-6 text-center">
                      <p className="text-xs font-bold text-blue-500 uppercase mb-2">Nomor Virtual Account</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-black text-blue-600 tracking-wider">8802 0812 3456</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100"><Copy size={14} /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <ShieldCheck size={14} className="text-primary" /> Aman & Terverifikasi
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {paymentStep === 'detail' && (
              <Button variant="outline" onClick={() => setPaymentStep('select')} className="w-full sm:w-auto">
                Kembali
              </Button>
            )}
            {paymentStep === 'detail' && (
              <Button onClick={() => setShowPayment(false)} className="w-full sm:w-auto">
                Konfirmasi Pembayaran
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- CHAT ROOM --- */}
      {activeChatExpert && (
        <ChatRoom
          expert={activeChatExpert}
          onClose={() => setActiveChatExpert(null)}
        />
      )}
    </div>
  );
};

export default ConsultView;