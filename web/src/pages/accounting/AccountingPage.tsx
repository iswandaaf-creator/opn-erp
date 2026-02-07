import { useState, useEffect } from 'react';
import { FileText, Activity } from 'lucide-react';

export function AccountingPage() {
    const [activeTab, setActiveTab] = useState<'journal' | 'pl' | 'balance'>('journal');
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(false);

    if (loading) return <div>Loading...</div>;

    // Mock Data for Reports (Backend logic for aggregating reports is complex, usually done via specific endpoints)
    const mockPL = {
        revenue: 150000000,
        cogs: 80000000,
        expenses: 25000000,
        netProfit: 45000000
    };

    useEffect(() => {
        if (activeTab === 'journal') fetchMoves();
    }, [activeTab]);

    const fetchMoves = async () => {
        setLoading(true);
        try {
            // Placeholder endpoint
            // const res = await api.get('/accounting/moves');
            // setMoves(res.data);
            setMoves([
                { id: 1, date: '2024-02-01', ref: 'INV/2024/001', debit: 150000, credit: 150000, state: 'POSTED' },
                { id: 2, date: '2024-02-02', ref: 'POS/2024/055', debit: 45000, credit: 45000, state: 'POSTED' },
            ] as any);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Financial Accounting</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => alert("Open Create Journal Entry Modal (Stub)")}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                        + New Entry
                    </button>
                    <div className="h-8 w-px bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'journal' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Journal Entries
                    </button>
                    <button
                        onClick={() => setActiveTab('pl')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pl' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Profit & Loss
                    </button>
                    <button
                        onClick={() => setActiveTab('balance')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'balance' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Balance Sheet
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {activeTab === 'journal' && (
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-gray-400" /> General Ledger
                        </h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Reference</th>
                                    <th className="pb-3 font-medium text-right">Debit</th>
                                    <th className="pb-3 font-medium text-right">Credit</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {moves.map((m: any) => (
                                    <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 text-sm">{m.date}</td>
                                        <td className="py-3 text-sm font-medium text-gray-900">{m.ref}</td>
                                        <td className="py-3 text-sm text-right text-indigo-600">Rp {m.debit.toLocaleString()}</td>
                                        <td className="py-3 text-sm text-right text-indigo-600">Rp {m.credit.toLocaleString()}</td>
                                        <td className="py-3 text-sm">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{m.state}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'pl' && (
                    <div className="max-w-2xl mx-auto">
                        <h3 className="font-bold text-lg mb-6 text-center text-gray-800">Profit & Loss Statement</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                                <span className="font-medium text-green-800">Total Revenue</span>
                                <span className="font-bold text-lg text-green-800">Rp {mockPL.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2 text-gray-500">
                                <span>Cost of Goods Sold (COGS)</span>
                                <span>(Rp {mockPL.cogs.toLocaleString()})</span>
                            </div>
                            <div className="px-4"><hr /></div>
                            <div className="flex justify-between items-center px-4 font-bold text-gray-700">
                                <span>Gross Profit</span>
                                <span>Rp {(mockPL.revenue - mockPL.cogs).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2 text-gray-500">
                                <span>Operating Expenses</span>
                                <span>(Rp {mockPL.expenses.toLocaleString()})</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-lg shadow-lg mt-6">
                                <span className="font-bold">Net Profit</span>
                                <span className="font-bold text-2xl">Rp {mockPL.netProfit.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'balance' && (
                    <div className="text-center text-gray-400 py-10">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Balance Sheet Report Visualization Placeholder</p>
                        <p className="text-xs mt-2">Requires real-time aggregation of Assets = Liability + Equity</p>
                    </div>
                )}
            </div>
        </div>
    );
}
