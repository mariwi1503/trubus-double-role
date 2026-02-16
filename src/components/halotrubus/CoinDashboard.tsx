import React, { useState } from 'react';
import { ArrowLeft, Plus, History, Wallet, ChevronRight, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { useTrubusCoin } from '@/context/TrubusCoinContext';

interface CoinDashboardProps {
    onBack: () => void;
}

const CoinDashboard: React.FC<CoinDashboardProps> = ({ onBack }) => {
    const { balance, transactions, topUp, formatCurrency } = useTrubusCoin();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState<number | null>(null);

    const topUpOptions = [20000, 50000, 100000, 200000, 500000];

    const handleTopUp = (amount: number) => {
        topUp(amount);
        setIsTopUpOpen(false);
        setTopUpAmount(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-30 shadow-sm border-b">
                <button onClick={onBack} className="p-3 bg-gray-50 rounded-2xl active:scale-90 transition-transform">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Trubus Coin</h2>
            </div>

            <div className="p-6 space-y-6">
                {/* Card Balance */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-green-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Wallet size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Saldo Anda</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-6">{formatCurrency(balance)}</h1>
                        <button
                            onClick={() => setIsTopUpOpen(true)}
                            className="w-full py-4 bg-white text-green-600 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                        >
                            <Plus size={18} /> Isi Saldo
                        </button>
                    </div>
                </div>

                {/* History */}
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Riwayat Transaksi</h3>
                    <div className="bg-white rounded-[2.2rem] shadow-sm overflow-hidden border border-gray-100 min-h-[300px]">
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 text-gray-400">
                                <History size={48} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold">Belum ada transaksi</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {transactions.map((trx) => (
                                    <div key={trx.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${trx.type === 'topup' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {trx.type === 'topup' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{trx.description}</h4>
                                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                                                {new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className={`font-black text-sm whitespace-nowrap ${trx.type === 'topup' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {trx.type === 'topup' ? '+' : '-'}{formatCurrency(trx.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Up Modal */}
            {isTopUpOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTopUpOpen(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-gray-900">Isi Saldo Trubus Coin</h3>
                            <button onClick={() => setIsTopUpOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                                <ArrowLeft size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {topUpOptions.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => handleTopUp(amount)}
                                        className="p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                                    >
                                        <span className="block text-gray-400 text-[10px] font-bold uppercase mb-1">Nominal</span>
                                        <span className="block text-lg font-black text-gray-900 group-hover:text-green-600">{formatCurrency(amount)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinDashboard;
