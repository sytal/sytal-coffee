<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'category', 'description', 'price', 'image', 'tags', 'sort_order', 'is_available',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_available' => 'boolean',
    ];

    /**
     * Prices are stored as display strings (e.g. "Rs. 650") so the menu can
     * show any currency formatting the owner wants. Orders need an actual
     * number to total up, so this pulls the digits back out server-side
     * (never trusting a price the client sends) for order totals.
     */
    public function numericPrice(): float
    {
        preg_match('/[\d,]+(\.\d+)?/', (string) $this->price, $matches);

        return isset($matches[0]) ? (float) str_replace(',', '', $matches[0]) : 0.0;
    }
}
