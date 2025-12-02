<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class InstructorController extends Controller
{
    /**
     * Mostrar lista de instructores
     */
    public function index()
    {
        // Obtener todos los instructores (no solo activos) para debugging
        $instructores = Instructor::orderBy('nombres')->get();
        
        return Inertia::render('Admin/Instructores/Index', [
            'instructores' => [
                'data' => $instructores
            ]
        ]);
    }

    /**
     * Mostrar formulario para crear nuevo instructor
     */
    public function create()
    {
        return Inertia::render('Admin/Instructores/Create');
    }

    /**
     * Guardar nuevo instructor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'documento_identidad' => 'required|string|unique:instructors,documento_identidad|max:20',
            'tipo_documento' => 'required|in:CC,CE,PA,TI',
            'email' => 'required|email|unique:instructors,email|max:255',
            'telefono' => 'nullable|string|max:20',
            'area_asignada' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'fecha_ingreso' => 'required|date',
            'hora_entrada_programada' => 'required|date_format:H:i',
            'hora_salida_programada' => 'required|date_format:H:i',
            'codigo_barras' => 'nullable|string|unique:instructors,codigo_barras|max:255',
            'direccion' => 'nullable|string|max:500',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        // Generar código de instructor automáticamente
        $ultimoInstructor = Instructor::orderBy('id', 'desc')->first();
        $numeroSiguiente = $ultimoInstructor ? $ultimoInstructor->id + 1 : 1;
        $validated['codigo_instructor'] = 'INST-' . str_pad($numeroSiguiente, 4, '0', STR_PAD_LEFT);

        // Si no se proporciona código de barras, generarlo automáticamente
        if (empty($validated['codigo_barras'])) {
            $validated['codigo_barras'] = 'BAR-' . time() . '-' . $numeroSiguiente;
        }

        // Establecer valores por defecto
        $validated['estado'] = 'activo';
        $validated['cargo'] = $validated['cargo'] ?: 'Instructor';

        Instructor::create($validated);

        return redirect()->route('admin.instructores.index')
                        ->with('success', 'Instructor creado exitosamente.');
    }

    /**
     * Mostrar detalles de un instructor específico
     */
    public function show($id)
    {
        // Buscar el instructor manualmente
        $instructor = Instructor::with(['asistencias' => function ($query) {
            $query->orderBy('fecha_hora_registro', 'desc')->limit(10);
        }])->find($id);
        
        if (!$instructor) {
            return Inertia::render('Admin/Instructores/Show', [
                'instructor' => null
            ]);
        }

        return Inertia::render('Admin/Instructores/Show', [
            'instructor' => $instructor
        ]);
    }

    /**
     * Mostrar formulario para editar instructor
     */
    public function edit(Instructor $instructor)
    {
        return Inertia::render('Admin/Instructores/Edit', [
            'instructor' => $instructor
        ]);
    }

    /**
     * Actualizar instructor
     */
    public function update(Request $request, Instructor $instructor)
    {
        $validated = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'documento_identidad' => [
                'required',
                'string',
                'max:20',
                Rule::unique('instructors')->ignore($instructor->id)
            ],
            'tipo_documento' => 'required|in:CC,CE,PA,TI',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('instructors')->ignore($instructor->id)
            ],
            'telefono' => 'nullable|string|max:20',
            'area_asignada' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'fecha_ingreso' => 'required|date',
            'hora_entrada_programada' => 'required|date_format:H:i',
            'hora_salida_programada' => 'required|date_format:H:i',
            'codigo_barras' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('instructors')->ignore($instructor->id)
            ],
            'direccion' => 'nullable|string|max:500',
            'observaciones' => 'nullable|string|max:1000',
            'estado' => 'required|in:activo,inactivo,suspendido',
        ]);

        $instructor->update($validated);

        return redirect()->route('admin.instructores.index')
                        ->with('success', 'Instructor actualizado exitosamente.');
    }

    /**
     * Eliminar instructor
     */
    public function destroy($id)
    {
        try {
            $instructor = Instructor::find($id);
            
            if (!$instructor) {
                \Log::error('Instructor no encontrado con ID: ' . $id);
                return response()->json(['error' => 'Instructor no encontrado'], 404);
            }
            
            \Log::info('Intentando eliminar instructor ID: ' . $instructor->id . ', Estado actual: ' . $instructor->estado);
            
            // Cambiar el estado a inactivo en lugar de eliminar físicamente
            $resultado = $instructor->update(['estado' => 'inactivo']);
            
            \Log::info('Resultado de update: ' . ($resultado ? 'exitoso' : 'fallido'));
            \Log::info('Instructor ' . $instructor->id . ' marcado como inactivo. Nuevo estado: ' . $instructor->fresh()->estado);

            // Retornar una respuesta sin contenido (204 No Content)
            return response()->noContent();
        } catch (\Exception $e) {
            \Log::error('Error al eliminar instructor: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al eliminar el instructor: ' . $e->getMessage()
            ], 500);
        }
    }
}
