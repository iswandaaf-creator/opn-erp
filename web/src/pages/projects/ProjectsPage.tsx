import { Construction } from 'lucide-react';

export function ProjectsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Projects Management</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Construction size={48} className="mx-auto text-indigo-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Under Construction</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    The Projects module is currently being built. This will allow for tracking factory expansion projects and large-scale maintenance.
                </p>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg inline-block text-left">
                    <p className="font-medium text-gray-700 mb-2">Planned Features:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Project Gantt Charts</li>
                        <li>Resource Allocation</li>
                        <li>Budget vs Actuals Tracking</li>
                        <li>Milestone Management</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
