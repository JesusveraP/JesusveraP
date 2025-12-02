<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\RedirectResponse;

class AdminUserController extends Controller
{
    /**
     * Admin puede resetear cualquier usuario sin correo.
     * Devuelve password generado o usa uno enviado por request.
     */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        // Si el admin manda una contraseña manual, úsala;
        // si no, generamos una aleatoria segura.
        $newPassword = $request->input('password') ?: Str::random(10);

        $user->password = Hash::make($newPassword);
        $user->save();

        // Importante: NO enviamos correo aquí (por tu requerimiento)

        return back()->with('status', "Contraseña restablecida para {$user->name}. Nueva contraseña: {$newPassword}");
    }
}
