import { usePage } from '@inertiajs/react';

export default function ThemeButton({
    className = '',
    disabled,
    children,
    variant = 'primary', // primary, secondary, danger, success, warning, info
    size = 'base', // sm, base, lg
    ...props
}) {
    const { systemSettings } = usePage().props;
    const primaryColor = systemSettings?.primary_color || 'green';

    // Mapeo de variantes de botones por color
    const variantClasses = {
        primary: {
            green: 'bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white border-green-700',
            blue: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white border-blue-700',
            indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white border-indigo-700',
            purple: 'bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white border-purple-700',
            red: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white border-red-700',
            orange: 'bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white border-orange-700',
            yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700 text-white border-yellow-700',
            teal: 'bg-teal-600 hover:bg-teal-700 focus:bg-teal-700 text-white border-teal-700',
            cyan: 'bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 text-white border-cyan-700',
            slate: 'bg-slate-600 hover:bg-slate-700 focus:bg-slate-700 text-white border-slate-700',
            stone: 'bg-stone-600 hover:bg-stone-700 focus:bg-stone-700 text-white border-stone-700',
        },
        secondary: {
            green: 'border-green-300 bg-white text-green-700 hover:bg-green-50',
            blue: 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50',
            indigo: 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50',
            purple: 'border-purple-300 bg-white text-purple-700 hover:bg-purple-50',
            red: 'border-red-300 bg-white text-red-700 hover:bg-red-50',
            orange: 'border-orange-300 bg-white text-orange-700 hover:bg-orange-50',
            yellow: 'border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50',
            teal: 'border-teal-300 bg-white text-teal-700 hover:bg-teal-50',
            cyan: 'border-cyan-300 bg-white text-cyan-700 hover:bg-cyan-50',
            slate: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            stone: 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50',
        },
        danger: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 text-white',
        info: 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white',
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        base: 'px-4 py-2 text-xs',
        lg: 'px-6 py-3 text-sm',
    };

    let selectedColorClass = '';
    if (variant === 'primary' || variant === 'secondary') {
        selectedColorClass = variantClasses[variant][primaryColor] || variantClasses[variant].green;
    } else {
        selectedColorClass = variantClasses[variant];
    }

    const selectedSizeClass = sizeClasses[size] || sizeClasses.base;

    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedSizeClass} ${selectedColorClass} ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}