import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ className = "", size = "auth", ...props }) {
    return (
        <div className={`flex items-center justify-center w-20 h-20 bg-green-600 rounded-full ${className}`}>
            <span className="text-white font-bold text-2xl">SENA</span>
        </div>
    );
}
