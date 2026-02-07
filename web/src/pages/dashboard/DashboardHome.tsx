import { BarChart3, Users, AlertCircle, DollarSign } from 'lucide-react';

export function DashboardHome() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Widget
                    title="Total Sales"
                    value="Rp 120.500.000"
                    icon={DollarSign}
                    trend="+12% from last month"
                    color="text-green-600"
                />
                <Widget
                    title="Active Employees"
                    value="45"
                    icon={Users}
                    trend="2 new this week"
                    color="text-blue-600"
                />
                <Widget
                    title="Pending Orders"
                    value="12"
                    icon={BarChart3}
                    trend="5 urgent"
                    color="text-orange-600"
                />
                <Widget
                    title="Low Stock Items"
                    value="8 SKUs"
                    icon={AlertCircle}
                    trend="Needs reorder"
                    color="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
                    <p className="text-slate-400">Sales Chart Placeholder</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
                    <p className="text-slate-400">Recent Activity Placeholder</p>
                </div>
            </div>
        </div>
    );
}

function Widget({ title, value, icon: Icon, trend, color }: any) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <div className={`p-2 rounded-full bg-slate-50 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <p className="text-xs text-slate-400 mt-1">{trend}</p>
        </div>
    )
}
