<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'Pending';

    public const STATUS_PREPARING = 'Preparing';

    public const STATUS_OUT_FOR_DELIVERY = 'Out for Delivery';

    public const STATUS_COMPLETED = 'Completed';

    public const STATUS_CANCELLED = 'Cancelled';

    /** Pending → Preparing → Out for Delivery → Completed */
    public const FLOW = ['Pending', 'Preparing', 'Out for Delivery', 'Completed'];

    protected $fillable = [
        'user_id', 'delivery_address', 'phone', 'notes', 'status',
        'subtotal', 'delivery_fee', 'payment_method', 'total',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
