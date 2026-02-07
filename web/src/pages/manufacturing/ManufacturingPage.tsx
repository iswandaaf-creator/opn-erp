import { useState } from 'react';
import { Factory, PenTool, Play, CheckCircle } from 'lucide-react';

export function ManufacturingPage() {
    const [activeTab, setActiveTab] = useState<'mo' | 'bom'>('mo');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data
    const boms = [
        { id: 1, product: 'Laptop Gaming X1 (Bundle)', qty: 1, components: 5 },
        { id: 2, product: 'Office Desk Set', qty: 1, components: 3 },
    ];

    const mos = [
        { id: 'MO/24/001', product: 'Laptop Gaming X1 (Bundle)', qty: 10, status: 'DONE' },
        { id: 'MO/24/002', product: 'Office Desk Set', qty: 5, status: 'CONFIRMED' },
        { id: 'MO/24/003', product: 'Office Desk Set', qty: 2, status: 'DRAFT' },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manufacturing</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('mo')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mo' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Manufacturing Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('bom')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bom' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Bill of Materials (BOM)
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {activeTab === 'mo' && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Factory size={20} className="text-gray-400" /> Manufacturing Orders
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700">
                                + Create Order
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="pb-3 font-medium">Reference</th>
                                    <th className="pb-3 font-medium">Product</th>
                                    <th className="pb-3 font-medium text-right">Quantity</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mos.map((mo) => (
                                    <tr key={mo.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 text-sm font-medium text-gray-900">{mo.id}</td>
                                        <td className="py-3 text-sm text-gray-600">{mo.product}</td>
                                        <td className="py-3 text-sm text-right">{mo.qty}</td>
                                        <td className="py-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                          ${mo.status === 'DONE' ? 'bg-green-100 text-green-700' :
                                                    mo.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {mo.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-right">
                                            {mo.status === 'CONFIRMED' && (
                                                <button className="text-orange-600 hover:text-orange-800 flex items-center justify-end gap-1 w-full">
                                                    <Play size={14} /> Produce
                                                </button>
                                            )}
                                            {mo.status === 'DRAFT' && (
                                                <button className="text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 w-full">
                                                    <CheckCircle size={14} /> Confirm
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'bom' && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <PenTool size={20} className="text-gray-400" /> Bill of Materials
                            </h3>
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700">
                                + New BOM
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="pb-3 font-medium">Product Output</th>
                                    <th className="pb-3 font-medium text-right">Qty</th>
                                    <th className="pb-3 font-medium text-right">Components</th>
                                    <th className="pb-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boms.map((bom) => (
                                    <tr key={bom.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 text-sm font-medium text-gray-900">{bom.product}</td>
                                        <td className="py-3 text-sm text-right">{bom.qty}</td>
                                        <td className="py-3 text-sm text-right">{bom.components} Items</td>
                                        <td className="py-3 text-sm text-right">
                                            <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Create Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Create Manufacturing Order</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product</label>
                                <select className="w-full border p-2 rounded mt-1">
                                    <option>Laptop Gaming X1 (Bundle)</option>
                                    <option>Office Desk Set</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input type="number" className="w-full border p-2 rounded mt-1" defaultValue={1} />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
