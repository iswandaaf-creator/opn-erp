import { Settings } from 'lucide-react';

export function SettingsPage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Settings className="text-gray-600" /> Settings
                </h1>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">System settings and configurations will appear here.</p>
                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                    🚧 Work in Progress
                </div>
            </div>
        </div>
    );
}
