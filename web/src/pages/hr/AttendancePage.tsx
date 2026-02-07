import { Calendar } from 'lucide-react';

export function AttendancePage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
                <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Calendar size={18} />
                    Filter Date
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <div className="flex justify-center mb-4 text-indigo-200">
                    <Calendar size={64} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Attendance Data</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    Attendance logs from the Mobile App will appear here. Employees can clock in/out using the mobile application.
                </p>
            </div>
        </div>
    );
}
