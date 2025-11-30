export const calculateBalances = (partners, expenses, payments) => {
    // 1. Calculate total spending
    const totalSpending = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // 2. Calculate fair share per person (assuming equal split for now)
    // TODO: Handle custom splits if needed
    const sharePerPerson = totalSpending / partners.length;

    // 3. Initialize balances
    const balances = {};
    partners.forEach(p => {
        balances[p.id] = {
            id: p.id,
            name: p.name,
            paid: 0, // Amount they paid for expenses
            received: 0, // Payments received from others
            sent: 0, // Payments sent to others
            net: 0 // Final balance (Positive = Owed, Negative = Owes)
        };
    });

    // 4. Process Expenses (Credits)
    expenses.forEach(exp => {
        if (balances[exp.payerId]) {
            balances[exp.payerId].paid += Number(exp.amount);
        }
    });

    // 5. Process Payments (Settlements)
    payments.forEach(pay => {
        if (balances[pay.fromId]) {
            balances[pay.fromId].sent += Number(pay.amount);
        }
        if (balances[pay.toId]) {
            balances[pay.toId].received += Number(pay.amount);
        }
    });

    // 6. Calculate Net
    // Net = (Paid - Share) + (Sent - Received)
    // Wait:
    // If I paid 100, share is 25. I am +75.
    // If I receive 25, I am +50. (My credit reduces).
    // So: Net = (Paid - Share) - Received + Sent?
    // Let's trace:
    // Shwan pays 100. Share 25. Net +75.
    // Adrees pays 0. Share 25. Net -25.
    // Adrees pays Shwan 25.
    // Shwan: Paid 100. Received 25. Sent 0.
    // Adrees: Paid 0. Received 0. Sent 25.
    // Shwan New Net should be +50.
    // Formula: (Paid - Share) - Received + Sent ??
    // 75 - 25 + 0 = 50. Correct.
    // Adrees New Net should be 0.
    // -25 - 0 + 25 = 0. Correct.

    Object.values(balances).forEach(b => {
        b.net = (b.paid - sharePerPerson) - b.received + b.sent;
    });

    return Object.values(balances);
};
