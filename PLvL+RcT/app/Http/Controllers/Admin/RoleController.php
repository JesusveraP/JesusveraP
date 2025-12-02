<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Mostrar gestión de roles
     */
    public function index(Request $request)
    {
        $roleFilter = $request->get('role');
        
        $query = User::query();
        
        if ($roleFilter) {
            $query->where('role', $roleFilter);
        }
        
        $users = $query->paginate(15);
        
        $stats = $this->getUserStats();

        return Inertia::render('Admin/Roles/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->all()
        ]);
    }

    /**
     * Crear nuevo rol/usuario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|in:admin,guardia,instructor',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'password' => bcrypt($validated['password']),
                'email_verified_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Usuario creado exitosamente con rol: ' . $validated['role']);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear usuario: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar rol de usuario
     */
    public function update(Request $request, User $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $role->id,
            'role' => 'required|in:admin,guardia,instructor',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = bcrypt($validated['password']);
            }

            $role->update($updateData);

            return redirect()->back()->with('success', 'Usuario actualizado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar usuario: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar usuario
     */
    public function destroy(User $role)
    {
        try {
            // No permitir eliminar el último administrador
            if ($role->role === 'admin') {
                $adminCount = User::where('role', 'admin')->count();
                if ($adminCount <= 1) {
                    return redirect()->back()->with('error', 'No se puede eliminar el último administrador del sistema');
                }
            }

            $role->delete();

            return redirect()->back()->with('success', 'Usuario eliminado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar usuario: ' . $e->getMessage());
        }
    }

    /**
     * Obtener estadísticas de usuarios por rol
     */
    public function getUserStats()
    {
        return [
            'total' => User::count(),
            'admin' => User::where('role', 'admin')->count(),
            'guardia' => User::where('role', 'guardia')->count(),
            'instructor' => User::where('role', 'instructor')->count(),
        ];
    }
}
