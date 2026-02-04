import React, { useState } from 'react';
import { 
  X, Star, MessageCircle, 
  GraduationCap, Briefcase, ChevronRight, 
  Award, CheckCircle2, ShieldCheck, Zap, CreditCard, 
  Calendar, Clock, ChevronLeft, Lock, Copy, AlertCircle
} from 'lucide-react';
import { Expert, formatPrice } from '@/data/dummyData';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert | null;
  onBookConsultation: (expert: Expert, date: string, time: string, type: string) => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  expert,
  onBookConsultation
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('bca');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !expert) return null;

  // Mock Data
  const availableDates = ['Besok, 5 Feb', 'Jumat, 6 Feb', 'Sabtu, 7 Feb'];
  const availableTimes = ['09:00', '11:00', '14:00', '16:00', '19:00'];
  
  const paymentDetails: Record<string, any> = {
    bca: { name: 'BCA Virtual Account', number: '1668176888', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg', cat: 'Transfer' },
    gopay: { name: 'GoPay', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', cat: 'E-Wallet' },
    ovo: { name: 'OVO', number: '0812-3456-7890', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', cat: 'E-Wallet' }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFinish = () => {
    onBookConsultation(expert, selectedDate, selectedTime, 'chat');
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 flex">
          <div 
            className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-8 border-b border-gray-50 bg-white">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
                <ChevronLeft size={22} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {step === 1 ? 'Detail Profil' : step === 2 ? 'Pilih Jadwal' : step === 3 ? 'Pembayaran' : 'Instruksi Bayar'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Langkah {step} dari 4</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900 group">
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          
          {/* STEP 1: DETAIL PROFIL (DESAIN ORIGINAL) */}
          {step === 1 && (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="relative bg-gray-50 p-6 rounded-[2.5rem] overflow-hidden border border-gray-100">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
                <div className="flex gap-6 relative z-10">
                  <div className="relative shrink-0">
                    <img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-white shadow-xl" />
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-gray-50">
                      <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{expert.name}</h3>
                    <p className="text-green-600 font-bold text-sm">{expert.specialization}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 text-[10px] font-black bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg">
                        <Star size={10} className="fill-yellow-900" /> {expert.rating}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded-lg uppercase tracking-tighter">
                        Verified Expert
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Briefcase size={20} className="text-blue-500 mb-2" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Pengalaman</span>
                  <p className="text-xs font-black text-gray-800">{expert.experience} Thn</p>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Award size={20} className="text-green-500 mb-2" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Sesi Chat</span>
                  <p className="text-xs font-black text-gray-800">{expert.consultations}+</p>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Zap size={20} className="text-yellow-500 mb-2" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Respon</span>
                  <p className="text-xs font-black text-gray-800">Cepat</p>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Bio Ahli</h4>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{expert.bio}</p>
                </div>
                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <GraduationCap className="text-blue-600 shrink-0" size={20} />
                  <p className="text-xs font-bold text-blue-900 leading-tight">Lulusan {expert.education}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PENJADWALAN */}
          {step === 2 && (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest px-2 font-black">
                   Pilih Tanggal
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-5 rounded-[2rem] border-2 transition-all text-center ${
                        selectedDate === date 
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100' 
                        : 'border-gray-50 bg-gray-50 text-gray-400'
                      }`}
                    >
                      <p className="text-xs font-black leading-tight">{date}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                  Pilih Jam Tersedia
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3.5 rounded-xl border-2 transition-all text-xs font-bold ${
                        selectedTime === time 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-50 bg-gray-50 text-gray-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PEMBAYARAN */}
          {step === 3 && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">{formatPrice(expert.price)}</h3>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                     <span className="text-gray-400 uppercase tracking-tighter">Jadwal Sesi</span>
                     <span>{selectedDate}, {selectedTime}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(paymentDetails).map(([id, detail]) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${
                      paymentMethod === id ? 'border-green-500 bg-green-50/30' : 'border-gray-50 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                        <img src={detail.icon} alt={detail.name} className="max-h-full object-contain" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-gray-800 leading-none mb-1">{detail.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{detail.cat}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === id ? 'border-green-500 bg-green-500' : 'border-gray-100'
                    }`}>
                      {paymentMethod === id && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: INSTRUKSI PEMBAYARAN */}
          {step === 4 && (
            <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500">
              {/* Rekening Card */}
              <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 text-center space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Silahkan Transfer ke {paymentDetails[paymentMethod].name}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <h4 className="text-3xl font-black text-gray-900 tracking-wider">
                    {paymentDetails[paymentMethod].number}
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(paymentDetails[paymentMethod].number)}
                    className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-gray-100 active:scale-90 transition-all text-blue-600"
                  >
                    {isCopied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Nominal Transfer</p>
                  <p className="text-2xl font-black text-green-600">{formatPrice(expert.price)}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4 px-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Langkah Pembayaran</h4>
                <div className="space-y-4">
                  {[
                    `Buka aplikasi ${paymentDetails[paymentMethod].name} Anda`,
                    `Pilih menu Transfer / Virtual Account`,
                    `Masukkan nomor ${paymentDetails[paymentMethod].number}`,
                    `Pastikan nominal sesuai yaitu ${formatPrice(expert.price)}`,
                    `Simpan bukti transfer Anda`
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg shadow-gray-200">{i + 1}</span>
                      <p className="text-xs font-bold text-gray-600 leading-tight pt-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[10px] font-bold leading-tight uppercase tracking-tighter">
                  Selesaikan pembayaran maksimal dalam 2 jam agar jadwal konsultasi tidak hangus.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-50">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !expert.isOnline) || (step === 2 && (!selectedDate || !selectedTime))}
              className="group relative w-full py-5 bg-green-500 hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-green-200 active:scale-95 overflow-hidden"
            >
              <span className="flex items-center justify-center gap-2">
                {step === 1 ? 'Pilih Jadwal Sesi' : 'Lanjut ke Pembayaran'}
                <ChevronRight size={18} />
              </span>
            </button>
          ) : step === 3 ? (
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-5 bg-gray-50 text-gray-400 hover:text-gray-900 font-black uppercase text-xs tracking-widest rounded-[2rem] transition-all"
              >
                Ubah
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Lanjut
              </button>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Konfirmasi & Bayar <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;