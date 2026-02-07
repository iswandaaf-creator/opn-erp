import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Shield } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    is_custom: boolean;
    permissions: any;
}

export function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={18} />
                    Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-gray-500">Loading roles...</div>
                ) : roles.map((role) => (
                    <div key={role.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{role.name}</h3>
                                <p className="text-sm text-gray-500">{role.is_custom ? 'Custom Role' : 'System Role'}</p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                            {/* Simplified permission view */}
                            <p>{Object.keys(role.permissions || {}).length} Access Modules Configured</p>
                        </div>

                        <button className="w-full py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 font-medium">
                            Configure Permissions
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
