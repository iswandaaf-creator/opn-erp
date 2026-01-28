import { Card } from '../ui/Card';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../ui/Button';

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

export const StatCard = ({ label, value, trend, trendUp, icon: Icon, color = 'primary' }: StatCardProps) => {
    const colorMap = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent: 'bg-accent/10 text-accent',
        success: 'bg-emerald-500/10 text-emerald-500',
        warning: 'bg-amber-500/10 text-amber-500',
    };

    return (
        <Card hoverEffect className="flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{label}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl", colorMap[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={cn(
                        "font-medium",
                        trendUp ? "text-emerald-400" : "text-red-400"
                    )}>
                        {trend}
                    </span>
                    <span className="ml-2 text-gray-500">vs last month</span>
                </div>
            )}
        </Card>
    );
};
