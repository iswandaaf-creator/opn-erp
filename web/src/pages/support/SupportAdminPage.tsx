import { useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';

export function SupportAdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articles] = useState([
        { id: 1, title: 'How to create an Invoice', context: 'sales', published: true },
        { id: 2, title: 'Understanding Stock Movements', context: 'inventory', published: true },
        { id: 3, title: 'Setting up Printer', context: 'settings', published: false },
    ]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <HelpCircle className="text-purple-600" /> Help Center Management
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 flex items-center gap-2">
                    <Plus size={16} /> New Article
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                            <th className="py-4 px-6 font-medium">Article Title</th>
                            <th className="py-4 px-6 font-medium">Context Tag</th>
                            <th className="py-4 px-6 font-medium">Status</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{article.title}</td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        {article.context}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm">
                                    {article.published ? (
                                        <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">Published</span>
                                    ) : (
                                        <span className="text-gray-500 font-medium text-xs bg-gray-100 px-2 py-1 rounded">Draft</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-right flex justify-end gap-2">
                                    <button className="p-1 text-gray-400 hover:text-indigo-600"><Eye size={16} /></button>
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16} /></button>
                                    <button className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {articles.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No articles found. Create one to get started.
                    </div>
                )}
            </div>
            {/* Create Article Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[500px]">
                        <h3 className="text-lg font-bold mb-4">Create Help Article</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" className="w-full border p-2 rounded mt-1" placeholder="e.g. How to use POS" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Context Tag</label>
                                <input type="text" className="w-full border p-2 rounded mt-1" placeholder="e.g. pos_screen" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea className="w-full border p-2 rounded mt-1 h-32" placeholder="Article content..." />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
