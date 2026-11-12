<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

class ReservationService
{
    public function latest(?string $status = null): Collection
    {
        return Reservation::query()
            ->when($status && $status !== 'All', fn ($q) => $q->where('status', $status))
            ->orderByDesc('date')
            ->orderByDesc('time')
            ->get();
    }

    public function create(array $data): Reservation
    {
        return Reservation::create($data + ['status' => 'Pending']);
    }

    public function delete(Reservation $reservation): void
    {
        $reservation->delete();
        \App\Models\NotificationRead::where('type', 'reservation')->where('ref_id', $reservation->id)->delete();
    }

    public function updateStatus(Reservation $reservation, string $status): Reservation
    {
        $reservation->update(['status' => $status]);

        return $reservation;
    }
}
