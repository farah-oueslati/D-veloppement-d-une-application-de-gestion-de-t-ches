<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    // Les colonnes autorisées à être remplies en masse
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'category',
        'date',
        'deadline',
        'user_id',
    ];

    // Relation : une tâche appartient à un utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
