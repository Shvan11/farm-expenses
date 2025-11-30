import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { BalanceSummary } from './components/dashboard/BalanceSummary';
import { ActivityFeed } from './components/dashboard/ActivityFeed';
import { HistoryView } from './components/dashboard/HistoryView';
import { AddExpenseForm } from './components/forms/AddExpenseForm';
import { SettleUpForm } from './components/forms/SettleUpForm';
import { Button } from './components/ui/Button';
import { Plus, DollarSign, Home, History } from 'lucide-react';

const Dashboard = () => {
    const { balances } = useFarm();
    return (
        <div className="animate-fade-in">
            <BalanceSummary balances={balances} />
            <ActivityFeed />
        </div>
    );
};

const AppContent = () => {
    const [view, setView] = useState('dashboard'); // dashboard, add, settle, history

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">FarmShare</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mt-4">
                {view === 'dashboard' && <Dashboard />}
                {view === 'history' && <HistoryView />}
                {view === 'add' && <AddExpenseForm onClose={() => setView('dashboard')} />}
                {view === 'settle' && <SettleUpForm onClose={() => setView('dashboard')} />}
            </main>

            {/* Bottom Navigation (Mobile Friendly) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-20">
                <div className="container flex justify-around items-center">
                    <Button
                        variant={view === 'dashboard' ? 'primary' : 'secondary'}
                        onClick={() => setView('dashboard')}
                        className="flex-1 mx-1 px-2"
                    >
                        <Home size={20} />
                        <span className="hidden sm:inline ml-1">Home</span>
                    </Button>
                    <Button
                        variant={view === 'history' ? 'primary' : 'secondary'}
                        onClick={() => setView('history')}
                        className="flex-1 mx-1 px-2"
                    >
                        <History size={20} />
                        <span className="hidden sm:inline ml-1">History</span>
                    </Button>
                    <Button
                        variant={view === 'add' ? 'primary' : 'secondary'}
                        onClick={() => setView('add')}
                        className="flex-1 mx-1 px-2"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline ml-1">Expense</span>
                    </Button>
                    <Button
                        variant={view === 'settle' ? 'primary' : 'secondary'}
                        onClick={() => setView('settle')}
                        className="flex-1 mx-1 px-2"
                    >
                        <DollarSign size={20} />
                        <span className="hidden sm:inline ml-1">Settle</span>
                    </Button>
                </div>
            </nav>
        </div>
    );
};

function App() {
    return (
        <FarmProvider>
            <AppContent />
        </FarmProvider>
    );
}

export default App;
