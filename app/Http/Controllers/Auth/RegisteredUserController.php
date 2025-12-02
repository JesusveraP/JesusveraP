<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:20',
            'codigo_guardia' => 'required|string|max:50|unique:users,codigo_guardia',
            'ubicacion_asignada' => 'required|string|max:255',
            'hora_inicio_turno' => 'required|date_format:H:i',
            'hora_fin_turno' => 'required|date_format:H:i|after:hora_inicio_turno',
            'role' => 'required|in:guardia',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'codigo_guardia.unique' => 'Este código de vigilante ya está en uso.',
            'hora_fin_turno.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
            'phone.required' => 'El teléfono es obligatorio.',
            'ubicacion_asignada.required' => 'Debe seleccionar una ubicación asignada.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'codigo_guardia' => $request->codigo_guardia,
            'ubicacion_asignada' => $request->ubicacion_asignada,
            'hora_inicio_turno' => $request->hora_inicio_turno,
            'hora_fin_turno' => $request->hora_fin_turno,
            'role' => 'guardia', // Siempre guardia para registros públicos
            'turno_activo' => false,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // No hacer login automático - el vigilante debe ser aprobado por un admin
        return redirect()->route('login')->with('success', 
            '¡Registro exitoso! Tu cuenta será revisada por un administrador. Recibirás un correo de confirmación una vez aprobada.'
        );
    }
}
