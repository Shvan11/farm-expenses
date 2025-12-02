import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFarm } from '../../context/FarmContext';

export const AddExpenseForm = ({ onClose, initialData = null }) => {
    const { partners, addExpense, updateExpense } = useFarm();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [payerId, setPayerId] = useState(partners[0]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setDescription(initialData.description);
            setPayerId(initialData.payerId);
            setDate(initialData.date);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !payerId) return;

        const expenseData = {
            amount: parseFloat(amount),
            description,
            payerId,
            date,
            category: 'General', // Default for now
            splitType: 'equal'
        };

        if (initialData) {
            await updateExpense({ ...expenseData, id: initialData.id });
        } else {
            await addExpense(expenseData);
        }

        // Reset or close
        setAmount('');
        setDescription('');
        if (onClose) onClose();
    };

    return (
        <Card className="mb-6">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>

                <div>
                    <label className="label">Description</label>
                    <Input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Seeds, Fertilizer, etc."
                        required
                    />
                </div>

                <div>
                    <label className="label">Payer</label>
                    <select
                        className="input"
                        value={payerId}
                        onChange={e => setPayerId(e.target.value)}
                    >
                        {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label">Date</label>
                    <Input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    {onClose && <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>}
                    <Button type="submit">{initialData ? 'Update Expense' : 'Save Expense'}</Button>
                </div>
            </form>
        </Card>
    );
};
