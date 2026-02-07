import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Search, Filter } from 'lucide-react';

interface Product {
    id: number;
    sku: string;
    name: string;
    unit: string;
    selling_price: string; // Decimal comes as string
    purchase_price: string;
    stock_alert_limit: number;
}

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/inventory/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products Inventory</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name, SKU, or Barcode..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">SKU</th>
                            <th className="p-4 font-medium text-gray-600">Name</th>
                            <th className="p-4 font-medium text-gray-600">Selling Price</th>
                            <th className="p-4 font-medium text-gray-600">Alert Limit</th>
                            <th className="p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading products...</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-sm">{product.sku}</td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-xs text-gray-400">{product.unit}</div>
                                </td>
                                <td className="p-4 font-medium text-green-700">
                                    Rp {Number(product.selling_price).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                        &le; {product.stock_alert_limit}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                        {!loading && products.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found. Start by adding one.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
