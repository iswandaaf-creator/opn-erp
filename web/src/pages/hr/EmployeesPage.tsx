import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Search, User } from 'lucide-react';

interface Employee {
    id: number;
    full_name: string;
    nik: string;
    department: { name: string };
    join_date: string;
}

export function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/hr/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-gray-500">Loading employees...</div>
                ) : employees.map((emp) => (
                    <div key={emp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className="bg-gray-100 p-4 rounded-full text-gray-500">
                            <User size={32} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{emp.full_name}</h3>
                            <p className="text-sm text-gray-500">{emp.nik}</p>
                            <div className="mt-2 text-xs flex gap-2">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">{emp.department?.name || 'No Dept'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && employees.length === 0 && (
                    <div className="col-span-3 text-center text-gray-500 py-10">
                        No employees found.
                    </div>
                )}
            </div>
        </div>
    );
}
