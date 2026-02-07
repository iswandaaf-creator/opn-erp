import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button'; // reusing cn from Button or move to utils

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative overflow-hidden rounded-xl border border-white/10 bg-surface/50 backdrop-blur-md p-6 shadow-xl transition-all duration-300',
                    hoverEffect && 'hover:bg-surface/70 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30',
                    className
                )}
                {...props}
            >
                {/* Glass shine effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
