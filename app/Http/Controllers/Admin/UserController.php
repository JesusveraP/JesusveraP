<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        // Filtrar por búsqueda
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        // Filtrar por rol
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:user,admin',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users.index')
                        ->with('success', 'Usuario creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // Actualizar contraseña si se proporciona
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('admin.users.index')
                        ->with('success', 'Usuario actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevenir que el usuario se elimine a sí mismo
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')
                            ->with('error', 'No puedes eliminar tu propia cuenta');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
                        ->with('success', 'Usuario eliminado exitosamente');
    }
}
