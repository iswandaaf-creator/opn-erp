import { useState } from 'react';
import { Trello, Plus, Phone, Mail, DollarSign } from 'lucide-react';

export function CrmPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Mock Data
    const [leads] = useState([
        { id: 1, name: 'Project Laptop Procurement', contact: 'PT. Tech Indo', value: 150000000, stage: 'NEW' },
        { id: 2, name: 'Office Furniture Deal', contact: 'CV. Maju Jaya', value: 35000000, stage: 'QUALIFIED' },
        { id: 3, name: 'Catering Contract 2024', contact: 'Hotel Grand', value: 500000000, stage: 'PROPOSITION' },
    ]);

    const stages = ['NEW', 'QUALIFIED', 'PROPOSITION', 'WON', 'LOST'];

    const getLeadsByStage = (stage: string) => leads.filter(l => l.stage === stage);

    return (
        <div className="p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Trello className="text-pink-600" /> CRM Pipeline
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 flex items-center gap-2">
                    <Plus size={16} /> New Lead
                </button>
            </div>

            <div className="flex gap-4 min-w-max pb-4">
                {stages.map(stage => (
                    <div key={stage} className="w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0">
                        <h3 className="font-bold text-gray-700 mb-4 flex justify-between uppercase text-xs tracking-wider">
                            {stage}
                            <span className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{getLeadsByStage(stage).length}</span>
                        </h3>

                        <div className="space-y-3">
                            {getLeadsByStage(stage).map(lead => (
                                <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab">
                                    <h4 className="font-bold text-gray-800 mb-1">{lead.name}</h4>
                                    <p className="text-sm text-gray-500 mb-3">{lead.contact}</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                                            <DollarSign size={12} /> {lead.value.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 justify-end border-t pt-2 mt-2">
                                        <button className="p-1 text-gray-400 hover:text-blue-600"><Phone size={14} /></button>
                                        <button className="p-1 text-gray-400 hover:text-red-600"><Mail size={14} /></button>
                                    </div>
                                </div>
                            ))}

                            {getLeadsByStage(stage).length === 0 && (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-xs">No leads</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Create Lead Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">New CRM Lead</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lead Name / Opportunity</label>
                                <input type="text" className="w-full border p-2 rounded mt-1" placeholder="e.g. Big Project Y" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact</label>
                                <input type="text" className="w-full border p-2 rounded mt-1" placeholder="Customer Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Value (Rp)</label>
                                <input type="number" className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Save Lead</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
