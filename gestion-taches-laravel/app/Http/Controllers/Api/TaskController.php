<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Afficher toutes les tâches de l'utilisateur connecté
     */
    public function index()
    {
        return Task::where('user_id', Auth::id())->get();
    }

    /**
     * Ajouter une nouvelle tâche
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'category' => 'nullable|string',
            'date' => 'nullable|date',
            'deadline' => 'nullable|date',
        ]);

        $validated['user_id'] = Auth::id(); // L'utilisateur connecté
        return Task::create($validated);
    }

    /**
     * Afficher une tâche
     */
    public function show(string $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        return $task;
    }

    /**
     * Modifier une tâche
     */
    public function update(Request $request, string $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'category' => 'nullable|string',
            'date' => 'nullable|date',
            'deadline' => 'nullable|date',
        ]);

        $task->update($validated);
        return $task;
    }

    /**
     * Supprimer une tâche
     */
    public function destroy(string $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Tâche supprimée avec succès.']);
    }
}
