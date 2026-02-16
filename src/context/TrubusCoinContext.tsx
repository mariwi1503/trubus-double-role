import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
    id: string;
    type: 'topup' | 'payment' | 'refund';
    amount: number;
    date: string;
    description: string;
    status: 'success' | 'pending' | 'failed';
}

interface TrubusCoinContextType {
    balance: number;
    transactions: Transaction[];
    topUp: (amount: number) => void;
    pay: (amount: number, description: string) => boolean;
    formatCurrency: (amount: number) => string;
}

const TrubusCoinContext = createContext<TrubusCoinContextType | undefined>(undefined);

export const useTrubusCoin = () => {
    const context = useContext(TrubusCoinContext);
    if (!context) {
        throw new Error('useTrubusCoin must be used within a TrubusCoinProvider');
    }
    return context;
};

export const TrubusCoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedBalance = localStorage.getItem('trubus_coin_balance');
        const savedTransactions = localStorage.getItem('trubus_coin_transactions');

        if (savedBalance) setBalance(parseInt(savedBalance));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    }, []);

    // Save to localStorage whenever balance or transactions change
    useEffect(() => {
        localStorage.setItem('trubus_coin_balance', balance.toString());
        localStorage.setItem('trubus_coin_transactions', JSON.stringify(transactions));
    }, [balance, transactions]);

    const topUp = (amount: number) => {
        const newTransaction: Transaction = {
            id: `TX-${Date.now()}`,
            type: 'topup',
            amount: amount,
            date: new Date().toISOString(),
            description: 'Top Up Saldo',
            status: 'success'
        };

        setBalance(prev => prev + amount);
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const pay = (amount: number, description: string): boolean => {
        if (balance < amount) return false;

        const newTransaction: Transaction = {
            id: `TX-${Date.now()}`,
            type: 'payment',
            amount: amount,
            date: new Date().toISOString(),
            description: description,
            status: 'success'
        };

        setBalance(prev => prev - amount);
        setTransactions(prev => [newTransaction, ...prev]);
        return true;
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    return (
        <TrubusCoinContext.Provider value={{ balance, transactions, topUp, pay, formatCurrency }}>
            {children}
        </TrubusCoinContext.Provider>
    );
};
