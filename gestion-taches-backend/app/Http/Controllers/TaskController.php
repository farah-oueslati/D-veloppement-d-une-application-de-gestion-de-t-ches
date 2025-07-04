<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        // رجع كل المهام مع بيانات المستخدم المرتبط
        return Task::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'user_id' => 'required|exists:users,id',
            // أضف باقي الحقول التي تريدها
        ]);

        return Task::create($validated);
    }

    public function show(Task $task)
    {
        return $task->load('user');
    }

    public function update(Request $request, Task $task)
    {
        $task->update($request->all());
        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }
}

