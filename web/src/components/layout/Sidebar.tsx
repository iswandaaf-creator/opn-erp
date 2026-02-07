import { Home, Users, ShoppingCart, Settings, LogOut, Briefcase, Box, FileText, Factory, Trello, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { icon: Users, name: 'Users', path: '/dashboard/users', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { icon: Briefcase, name: 'Roles', path: '/dashboard/roles', roles: ['SUPER_ADMIN'] },
        { icon: Users, name: 'Employees', path: '/dashboard/hr/employees' },
        { icon: Box, name: 'Inventory', path: '/dashboard/inventory' },
        { icon: ShoppingCart, name: 'POS & Sales', path: '/dashboard/sales' },
        { icon: Factory, name: 'Manufacturing', path: '/dashboard/manufacturing' },
        { icon: Briefcase, name: 'Projects', path: '/dashboard/projects' },
        { icon: Trello, name: 'CRM', path: '/dashboard/crm' },
        { icon: HelpCircle, name: 'Support CMS', path: '/dashboard/support', roles: ['SUPER_ADMIN', 'OWNER'] },
        { icon: FileText, name: 'Accounting', path: '/dashboard/accounting', roles: ['SUPER_ADMIN', 'ADMIN'] },
        { icon: Settings, name: 'Settings', path: '/dashboard/settings' },
    ];

    // Super Admin Menu
    if (user?.role === 'SUPER_ADMIN') {
        menuItems.unshift({ name: 'Tenant Management', icon: Briefcase, path: '/admin/tenants' });
    }

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-white shadow-lg">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                    Nexus ERP
                </h1>
                {user?.tenantId && (
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user.tenantId}</p>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
