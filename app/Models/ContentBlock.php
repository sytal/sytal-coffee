<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentBlock extends Model
{
    protected $fillable = ['section_key', 'label', 'sort_order', 'fields'];

    protected $casts = [
        'fields' => 'array',
        'sort_order' => 'integer',
    ];
}
