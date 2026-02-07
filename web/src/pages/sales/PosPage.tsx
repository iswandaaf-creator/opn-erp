import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, QrCode } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    sku: string;
    selling_price: string;
    stock: number; // calculated from stock movements ideally, but we might just fetch simplified object
}

interface CartItem extends Product {
    qty: number;
}

export function PosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/inventory/products');
            // Mocking stock for now as backend returns pure product entities usually
            // Ideally backend returns stock balance in a different call or aggregated
            const productsData = response.data.map((p: any) => ({ ...p, stock: 100 }));
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.selling_price) * item.qty), 0);
    const tax = subtotal * 0.11; // Example 11% Tax
    const total = subtotal + tax;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-64px)] gap-6 p-6 overflow-hidden">
            {/* LEFT: Product Grid */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Search Header */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                    {loading ? <div className="col-span-full text-center p-10">Loading catalog...</div> : filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left flex flex-col justify-between h-40 group"
                        >
                            <div>
                                <div className="font-bold text-gray-800 line-clamp-2">{product.name}</div>
                                <div className="text-xs text-gray-400 mt-1">{product.sku}</div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="font-semibold text-indigo-600">
                                    Rp {Number(product.selling_price).toLocaleString()}
                                </div>
                                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-700">
                                    Add
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: Cart / Ticket */}
            <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCart size={20} /> Current Sale
                    </h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{cart.length} Items</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ShoppingCart size={48} opacity={0.2} />
                            <p className="mt-4 text-sm">Cart is empty</p>
                        </div>
                    ) : cart.map(item => (
                        <div key={item.id} className="flex gap-3">
                            <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{item.name}</div>
                                <div className="text-xs text-indigo-600 font-medium">Rp {Number(item.selling_price).toLocaleString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm">-</button>
                                <span className="w-4 text-center text-sm font-medium">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Totals Section */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>Rp {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Tax (11%)</span>
                            <span>Rp {tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100">
                            <Banknote size={16} className="mb-1" /> Cash
                        </button>
                        <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50">
                            <QrCode size={16} className="mb-1" /> QRIS
                        </button>
                        <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50">
                            <CreditCard size={16} className="mb-1" /> Card
                        </button>
                    </div>

                    <button disabled={cart.length === 0} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
