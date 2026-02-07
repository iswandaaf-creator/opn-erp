import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Edit } from 'lucide-react';

interface User {
    id: string;
    username: string;
    email: string;
    role: { name: string };
    is_active: boolean;
}

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Username</th>
                            <th className="p-4 font-medium text-gray-600">Email</th>
                            <th className="p-4 font-medium text-gray-600">Role</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading users...</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{user.role?.name || 'No Role'}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button className="text-gray-400 hover:text-indigo-600"><Edit size={18} /></button>
                                    <button className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
}
