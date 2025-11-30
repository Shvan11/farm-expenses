import React from 'react';
import { Card } from '../ui/Card';
import clsx from 'clsx';

export const BalanceSummary = ({ balances }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {balances.map(b => (
                <Card key={b.id} className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{b.name}</h3>
                        <p className="text-sm text-gray-500">
                            Paid: ${b.paid.toFixed(2)}
                        </p>
                    </div>
                    <div className={clsx(
                        "text-xl font-bold",
                        b.net >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                        {b.net >= 0 ? "+" : ""}{b.net.toFixed(2)}
                    </div>
                </Card>
            ))}
        </div>
    );
};
