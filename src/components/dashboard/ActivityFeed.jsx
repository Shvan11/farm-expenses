import React from 'react';
import { Card } from '../ui/Card';
import { useFarm } from '../../context/FarmContext';

export const ActivityFeed = () => {
    const { expenses, payments, partners } = useFarm();

    // Merge and sort
    const activities = [
        ...expenses.map(e => ({ ...e, type: 'expense' })),
        ...payments.map(p => ({ ...p, type: 'payment' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const getPartnerName = (id) => partners.find(p => p.id === id)?.name || 'Unknown';

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.length === 0 && <p className="text-gray-500">No activity yet.</p>}
                {activities.map(item => (
                    <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
                        <div>
                            <p className="font-medium">
                                {item.type === 'expense'
                                    ? `${getPartnerName(item.payerId)} paid for ${item.description}`
                                    : `${getPartnerName(item.fromId)} paid ${getPartnerName(item.toId)}`
                                }
                            </p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <div className={item.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                            {item.type === 'expense' ? '-' : ''}${item.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
