import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFarm } from '../../context/FarmContext';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export const HistoryView = () => {
    const { expenses, payments, partners } = useFarm();
    const [filter, setFilter] = useState('all'); // all, expense, payment

    const getPartnerName = (id) => partners.find(p => p.id === id)?.name || 'Unknown';

    const allActivities = [
        ...expenses.map(e => ({ ...e, type: 'expense', dateObj: new Date(e.date) })),
        ...payments.map(p => ({ ...p, type: 'payment', dateObj: new Date(p.date) }))
    ].sort((a, b) => b.dateObj - a.dateObj);

    const filteredActivities = allActivities.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('all')}
                    className="whitespace-nowrap"
                >
                    All
                </Button>
                <Button
                    variant={filter === 'expense' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('expense')}
                    className="whitespace-nowrap"
                >
                    Expenses
                </Button>
                <Button
                    variant={filter === 'payment' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('payment')}
                    className="whitespace-nowrap"
                >
                    Payments
                </Button>
            </div>

            <div className="space-y-4">
                {filteredActivities.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No history found.</div>
                )}

                {filteredActivities.map(item => (
                    <Card key={item.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={clsx(
                                    "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                                    item.type === 'expense' ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                )}>
                                    {item.type}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">{item.date}</span>
                            </div>
                            <div className="font-bold text-lg">
                                ${item.amount.toFixed(2)}
                            </div>
                        </div>

                        <div className="text-gray-800 font-medium">
                            {item.type === 'expense' ? item.description : 'Payment Settlement'}
                        </div>

                        <div className="text-sm text-gray-600">
                            {item.type === 'expense' ? (
                                <>Paid by <span className="font-semibold">{getPartnerName(item.payerId)}</span></>
                            ) : (
                                <><span className="font-semibold">{getPartnerName(item.fromId)}</span> paid <span className="font-semibold">{getPartnerName(item.toId)}</span></>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
