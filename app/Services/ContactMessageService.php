<?php

namespace App\Services;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Collection;

class ContactMessageService
{
    public function latest(): Collection
    {
        return ContactMessage::query()->orderByDesc('created_at')->get();
    }

    public function create(array $data): ContactMessage
    {
        return ContactMessage::create($data + ['status' => 'New']);
    }

    public function markRead(ContactMessage $message): ContactMessage
    {
        $message->update(['status' => 'Read']);

        return $message;
    }

    public function delete(ContactMessage $message): void
    {
        $message->delete();
    }
}
