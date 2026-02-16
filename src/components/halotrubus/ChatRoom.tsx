
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Bot, User as UserIcon, Loader2, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { Expert } from '@/data/dummyData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'expert' | 'system';
    time: string;
    isAi?: boolean;
    image?: string;
}

interface ChatRoomProps {
    expert: Expert;
    onClose: () => void;
    initialMessages?: Message[];
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const ChatRoom: React.FC<ChatRoomProps> = ({ expert, onClose, initialMessages = [] }) => {
    // Initial demo message if empty
    const defaultMessages: Message[] = expert.isAi
        ? [
            {
                id: '1',
                text: `Halo! Saya ${expert.name}. Ada yang bisa saya bantu mengenai tanaman Anda hari ini?`,
                sender: 'expert',
                time: formatTime(new Date()),
                isAi: true
            }
        ]
        : [
            {
                id: '1',
                text: 'Selamat datang! Silahkan deskripsikan permasalahan tanaman Anda, sertakan foto jika ada.',
                sender: 'expert',
                time: formatTime(new Date()),
            }
        ];

    const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : defaultMessages);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        if (!inputText.trim() && !selectedImage) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText || (selectedImage ? '📷 Gambar' : ''),
            sender: 'user',
            time: formatTime(new Date()),
            image: selectedImage || undefined
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // AI Logic
        if (expert.isAi) {
            setIsTyping(true);
            setTimeout(() => {
                const aiResponse = generateAiResponse(inputText, !!selectedImage);
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: aiResponse,
                    sender: 'expert',
                    time: formatTime(new Date()),
                    isAi: true
                };
                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
        }
    };

    const generateAiResponse = (input: string, hasImage: boolean = false): string => {
        const lowerInput = input.toLowerCase();

        // Response for image uploads
        if (hasImage) {
            if (lowerInput.includes('kuning') || lowerInput.includes('daun')) {
                return "Terima kasih sudah mengirimkan fotonya! Dari deskripsi daun menguning, kemungkinan besar ini masalah nutrisi atau pengairan. Daun menguning bisa disebabkan oleh kekurangan Nitrogen, kelebihan/kekurangan air, atau kurang sinar matahari. Coba cek kelembaban tanahnya dan pastikan tanaman mendapat cahaya cukup ya.";
            }
            if (lowerInput.includes('hama') || lowerInput.includes('kutu')) {
                return "Terima kasih fotonya! Untuk mengatasi hama, saya sarankan: 1) Semprotkan air sabun cair (1 sdm sabun + 1 liter air) pada bagian yang terkena hama, 2) Gunakan pestisida nabati dari bawang putih atau cabai, 3) Semprot di pagi atau sore hari. Ulangi setiap 3 hari sampai hama hilang.";
            }
            return "Terima kasih sudah mengirimkan fotonya! Dari gambar yang Anda kirim, saya bisa membantu menganalisis kondisi tanaman. Bisa dijelaskan lebih detail apa masalah yang Anda alami? Misalnya: pertumbuhan lambat, daun menguning, ada hama, atau lainnya?";
        }

        // Regular text responses
        if (lowerInput.includes('kuning') || lowerInput.includes('daun')) {
            return "Daun menguning bisa disebabkan oleh kekurangan air, kelebihan air, atau kekurangan nutrisi. Coba cek kelembaban tanahnya dulu ya. Apakah tanahnya terasa terlalu kering atau justru becek?";
        }
        if (lowerInput.includes('hama') || lowerInput.includes('kutu')) {
            return "Untuk hama kutu, Anda bisa mencoba semprotkan campuran air sabun cair tipis-tipis atau gunakan pestisida nabati dari ekstrak bawang putih. Pastikan semprot di bawah daun juga ya karena hama sering bersembunyi di sana.";
        }
        if (lowerInput.includes('pupuk')) {
            return "Pemupukan sebaiknya dilakukan sore hari atau pagi sekali. Untuk tanaman sayur daun, gunakan pupuk tinggi Nitrogen (N). Untuk tanaman buah, saat berbunga gunakan pupuk tinggi Kalium (K).";
        }
        if (lowerInput.includes('terima kasih') || lowerInput.includes('makasih')) {
            return "Sama-sama! Semoga tanamannya tumbuh subur ya. Jangan ragu tanya lagi kalau ada masalah lain. 🌱";
        }
        return "Maaf, saya masih belajar. Bisa dijelaskan lebih detail lagi kondisi tanamannya? Atau mungkin bisa kirimkan foto tanamannya untuk analisis lebih akurat!";
    };

    return (
        <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-[100vw] sm:w-[500px] p-0 flex flex-col gap-0 border-l-0 sm:border-l">
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-4 bg-background sticky top-0 shadow-sm z-10">
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar>
                                <AvatarImage src={expert.image} className="object-cover" />
                                <AvatarFallback>{expert.name[0]}</AvatarFallback>
                            </Avatar>
                            {expert.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm leading-tight flex items-center gap-1">
                                {expert.name}
                                {expert.isAi && <Sparkles size={12} className="text-blue-500 fill-blue-500" />}
                            </h4>
                            <div className="flex items-center gap-1.5">
                                {expert.isAi ? (
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">AI Assistant • Always Online</p>
                                ) : (
                                    <>
                                        <div className={`w-1.5 h-1.5 rounded-full ${expert.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{expert.isOnline ? 'Online' : 'Offline'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <ScrollArea className="flex-1 bg-muted/30 p-4">
                    <div className="flex flex-col gap-4 pb-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                                        ${msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : expert.isAi
                                                ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-none'
                                                : 'bg-card text-card-foreground border border-border rounded-tl-none'
                                        }`}
                                >
                                    {msg.isAi && (
                                        <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-blue-100/50">
                                            <Bot size={14} className="text-blue-500" />
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">AI Answer</span>
                                        </div>
                                    )}
                                    {msg.image && (
                                        <div className="mb-3">
                                            <img
                                                src={msg.image}
                                                alt="Attachment"
                                                className="rounded-xl max-w-full h-auto max-h-64 object-cover"
                                            />
                                        </div>
                                    )}
                                    <p>{msg.text}</p>
                                    <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none border border-blue-100 flex items-center gap-2">
                                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                                    <span className="text-xs font-bold text-blue-400">Sedang mengetik...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-background pb-8">
                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="mb-3 relative inline-block">
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="rounded-xl max-h-32 object-cover border-2 border-primary"
                            />
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg"
                            >
                                <X size={14} />
                            </Button>
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10 shrink-0"
                        >
                            <ImageIcon size={20} />
                        </Button>
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={expert.isAi ? "Tanya apa saja tentang tanaman..." : "Tulis pesan..."}
                            className="min-h-[44px] max-h-32 py-3 resize-none rounded-2xl"
                            rows={1}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={(!inputText.trim() && !selectedImage) || isTyping}
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-xl"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ChatRoom;
