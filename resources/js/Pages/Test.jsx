import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    ✅ React + Inertia.js funcionando correctamente
                </h1>
                <p className="text-gray-600 mb-4">
                    Si puedes ver este mensaje, el frontend está funcionando.
                </p>
                <a 
                    href="/login" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ir al Login
                </a>
            </div>
        </div>
    );
}