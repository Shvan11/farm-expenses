import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFarm } from '../../context/FarmContext';

export const SettleUpForm = ({ onClose, initialData = null }) => {
    const { partners, addPayment, updatePayment } = useFarm();
    const [amount, setAmount] = useState('');
    const [fromId, setFromId] = useState(partners[0]?.id || '');
    const [toId, setToId] = useState(partners[1]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setFromId(initialData.fromId);
            setToId(initialData.toId);
            setDate(initialData.date);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !fromId || !toId || fromId === toId) return;

        const paymentData = {
            amount: parseFloat(amount),
            fromId,
            toId,
            date
        };

        if (initialData) {
            await updatePayment({ ...paymentData, id: initialData.id });
        } else {
            await addPayment(paymentData);
        }

        setAmount('');
        if (onClose) onClose();
    };

    return (
        <Card className="mb-6">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Payment' : 'Settle Up'}</h2>
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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">From</label>
                        <select
                            className="input"
                            value={fromId}
                            onChange={e => setFromId(e.target.value)}
                        >
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">To</label>
                        <select
                            className="input"
                            value={toId}
                            onChange={e => setToId(e.target.value)}
                        >
                            {partners.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
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
                    <Button type="submit">{initialData ? 'Update Payment' : 'Record Payment'}</Button>
                </div>
            </form>
        </Card>
    );
};
