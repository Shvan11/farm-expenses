import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { calculateBalances } from '../utils/calculations';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
    const [partners, setPartners] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const [p, e, pay] = await Promise.all([
                StorageService.getPartners(),
                StorageService.getExpenses(),
                StorageService.getPayments()
            ]);
            setPartners(p);
            setExpenses(e);
            setPayments(pay);
            setBalances(calculateBalances(p, e, pay));
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const addExpense = async (expense) => {
        await StorageService.addExpense(expense);
        await refreshData();
    };

    const addPayment = async (payment) => {
        await StorageService.addPayment(payment);
        await refreshData();
    };

    return (
        <FarmContext.Provider value={{ partners, expenses, payments, balances, loading, addExpense, addPayment }}>
            {children}
        </FarmContext.Provider>
    );
};

export const useFarm = () => useContext(FarmContext);
