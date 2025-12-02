import { usePage } from '@inertiajs/react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    const { systemSettings } = usePage().props;
    const primaryColor = systemSettings?.primary_color || 'green';

    // Mapeo de colores a clases de Tailwind
    const colorClasses = {
        green: 'bg-green-600 hover:bg-green-700 focus:bg-green-700',
        blue: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700',
        indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700',
        purple: 'bg-purple-600 hover:bg-purple-700 focus:bg-purple-700',
        red: 'bg-red-600 hover:bg-red-700 focus:bg-red-700',
        orange: 'bg-orange-600 hover:bg-orange-700 focus:bg-orange-700',
        yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700',
        teal: 'bg-teal-600 hover:bg-teal-700 focus:bg-teal-700',
        cyan: 'bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700',
        slate: 'bg-slate-600 hover:bg-slate-700 focus:bg-slate-700',
        stone: 'bg-stone-600 hover:bg-stone-700 focus:bg-stone-700',
    };

    const selectedColorClass = colorClasses[primaryColor] || colorClasses.green;

    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out ${selectedColorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
