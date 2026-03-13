import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'sale' | 'new' | 'outline' | 'glass';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80',
        sale: 'border-transparent bg-rose-600 text-white hover:bg-rose-600/80',
        new: 'border-transparent bg-blue-600 text-white hover:bg-blue-600/80',
        outline: 'text-gray-950',
        glass: 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-900 shadow-sm'
    };

    return (
        <div 
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
                variants[variant],
                className
            )} 
            {...props} 
        />
    );
}
