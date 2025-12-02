import { usePage } from '@inertiajs/react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    const { systemSettings } = usePage().props;
    const primaryColor = systemSettings?.primary_color || 'green';

    // Mapeo de colores a clases de Tailwind para botones secundarios
    const colorClasses = {
        green: 'border-green-300 bg-white text-green-700 hover:bg-green-50 focus:ring-green-500 focus:border-green-500',
        blue: 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50 focus:ring-blue-500 focus:border-blue-500',
        indigo: 'border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500 focus:border-indigo-500',
        purple: 'border-purple-300 bg-white text-purple-700 hover:bg-purple-50 focus:ring-purple-500 focus:border-purple-500',
        red: 'border-red-300 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500 focus:border-red-500',
        orange: 'border-orange-300 bg-white text-orange-700 hover:bg-orange-50 focus:ring-orange-500 focus:border-orange-500',
        yellow: 'border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500 focus:border-yellow-500',
        teal: 'border-teal-300 bg-white text-teal-700 hover:bg-teal-50 focus:ring-teal-500 focus:border-teal-500',
        cyan: 'border-cyan-300 bg-white text-cyan-700 hover:bg-cyan-50 focus:ring-cyan-500 focus:border-cyan-500',
        slate: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500 focus:border-slate-500',
        stone: 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50 focus:ring-stone-500 focus:border-stone-500',
    };

    const selectedColorClass = colorClasses[primaryColor] || colorClasses.green;

    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-widest shadow-sm transition duration-150 ease-in-out ${selectedColorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
