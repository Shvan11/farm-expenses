import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFarm } from '../../context/FarmContext';
import { Button } from '../ui/Button';
import { AddExpenseForm } from '../forms/AddExpenseForm';
import { SettleUpForm } from '../forms/SettleUpForm';
import clsx from 'clsx';
import { Edit2, Trash2, X } from 'lucide-react';

export const HistoryView = () => {
    const { expenses, payments, partners, deleteExpense, deletePayment } = useFarm();
    const [filter, setFilter] = useState('all'); // all, expense, payment
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { id, type }

    const getPartnerName = (id) => partners.find(p => p.id === id)?.name || 'Unknown';

    const allActivities = [
        ...expenses.map(e => ({ ...e, type: 'expense', dateObj: new Date(e.date) })),
        ...payments.map(p => ({ ...p, type: 'payment', dateObj: new Date(p.date) }))
    ].sort((a, b) => b.dateObj - a.dateObj);

    const filteredActivities = allActivities.filter(item => {
        // Type Filter
        if (filter !== 'all' && item.type !== filter) return false;

        // Date Filter
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const itemDate = new Date(item.dateObj);
            itemDate.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const itemDate = new Date(item.dateObj);
            itemDate.setHours(0, 0, 0, 0);
            if (itemDate > end) return false;
        }

        return true;
    });

    const handleDeleteClick = (item) => {
        setDeleteConfirmation({ id: item.id, type: item.type });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;

        if (deleteConfirmation.type === 'expense') {
            await deleteExpense(deleteConfirmation.id);
        } else {
            await deletePayment(deleteConfirmation.id);
        }
        setDeleteConfirmation(null);
    };

    return (
        <div className="animate-fade-in pb-20 relative">
            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
                        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteConfirmation(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-in">
                        <button
                            onClick={() => setEditingItem(null)}
                            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>
                        <div className="p-6 pt-10">
                            {editingItem.type === 'expense' ? (
                                <AddExpenseForm
                                    initialData={editingItem}
                                    onClose={() => setEditingItem(null)}
                                />
                            ) : (
                                <SettleUpForm
                                    initialData={editingItem}
                                    onClose={() => setEditingItem(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('all')}
                        className="whitespace-nowrap rounded-full px-4"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'expense' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('expense')}
                        className="whitespace-nowrap rounded-full px-4"
                    >
                        Direct (Expenses)
                    </Button>
                    <Button
                        variant={filter === 'payment' ? 'primary' : 'secondary'}
                        onClick={() => setFilter('payment')}
                        className="whitespace-nowrap rounded-full px-4"
                    >
                        Indirect (Settlements)
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
                {(startDate || endDate) && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
                        >
                            <X size={12} /> Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {filteredActivities.length === 0 && (
                    <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p>No history found for this period.</p>
                    </div>
                )}

                {filteredActivities.map(item => (
                    <Card key={item.id} className="flex flex-col gap-3 relative group hover:shadow-md transition-shadow duration-200 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className={clsx(
                                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                        item.type === 'expense' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                        {item.type === 'expense' ? 'Direct' : 'Indirect'}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-4">&nbsp;{item.date}</span>
                                </div>
                                <div className="font-bold text-gray-900 text-lg leading-tight">
                                    {item.type === 'expense' ? item.description : 'Payment Settlement'}
                                </div>
                            </div>
                            <div className={clsx(
                                "font-bold text-lg",
                                item.type === 'expense' ? "text-gray-900" : "text-green-600"
                            )}>
                                ${item.amount.toFixed(2)}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {item.type === 'expense' ? (
                                <>Paid by <span className="font-semibold text-gray-900">{getPartnerName(item.payerId)}</span></>
                            ) : (
                                <><span className="font-semibold text-gray-900">{getPartnerName(item.fromId)}</span> paid <span className="font-semibold text-gray-900">{getPartnerName(item.toId)}</span></>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <Button
                                variant="secondary"
                                onClick={() => setEditingItem(item)}
                                className="!py-1.5 !px-3 text-xs"
                                title="Edit"
                            >
                                <Edit2 size={14} /> Edit
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => handleDeleteClick(item)}
                                className="!py-1.5 !px-3 text-xs !text-red-600 hover:!bg-red-50 !border-red-200"
                                title="Delete"
                            >
                                <Trash2 size={14} /> Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
