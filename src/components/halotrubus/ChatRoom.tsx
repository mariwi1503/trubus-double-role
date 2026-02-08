
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Bot, User as UserIcon, Loader2, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { Expert } from '@/data/dummyData';

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
            return "Daun menguning bisa disebabkan oleh beberapa hal: kekurangan air, kelebihan air, atau kekurangan nutrisi (biasanya Nitrogen). Coba cek kelembaban tanahnya dulu ya. Apakah tanahnya terasa terlalu kering atau justru becek?";
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
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300 font-sans">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 shadow-sm z-10">
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={expert.image} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt="" />
                        {expert.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 text-sm leading-tight flex items-center gap-1">
                            {expert.name}
                            {expert.isAi && <Sparkles size={12} className="text-blue-500 fill-blue-500" />}
                        </h4>
                        <div className="flex items-center gap-1.5">
                            {expert.isAi ? (
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">AI Assistant • Always Online</p>
                            ) : (
                                <>
                                    <div className={`w-1.5 h-1.5 rounded-full ${expert.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{expert.isOnline ? 'Online' : 'Offline'}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-50/50 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.sender === 'user'
                                    ? 'bg-green-500 text-white rounded-tr-none'
                                    : expert.isAi
                                        ? 'bg-blue-50 text-gray-800 border border-blue-100 rounded-tl-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}
                        >
                            {msg.isAi && (
                                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-blue-100">
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
                            <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
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

            {/* Input Area */}
            <div className="p-4 border-t bg-white pb-8">
                {/* Image Preview */}
                {selectedImage && (
                    <div className="mb-3 relative inline-block">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="rounded-xl max-h-32 object-cover border-2 border-green-500"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2 bg-gray-100 rounded-[1.5rem] px-2 py-2 border border-transparent focus-within:border-green-500/30 focus-within:bg-green-50/30 transition-all">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"
                    >
                        <ImageIcon size={20} />
                    </button>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={expert.isAi ? "Tanya apa saja tentang tanaman..." : "Tulis pesan..."}
                        className="bg-transparent flex-1 outline-none text-sm py-3 max-h-32 resize-none"
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!inputText.trim() && !selectedImage) || isTyping}
                        className="bg-green-500 p-3 rounded-xl text-white shadow-lg shadow-green-100 hover:bg-green-600 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
