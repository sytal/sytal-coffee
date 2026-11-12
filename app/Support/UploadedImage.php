<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Admin uploads live in public/uploads (the "uploads" disk) and are stored
 * in the DB as "/uploads/<dir>/<file>". Seeded images under /images/ are
 * part of the codebase and must never be deleted, so only /uploads/ paths
 * are ever removed.
 */
class UploadedImage
{
    public static function delete(?string $path): void
    {
        if (! $path || ! str_starts_with($path, '/uploads/')) {
            return;
        }

        Storage::disk('uploads')->delete(substr($path, strlen('/uploads/')));
    }
}
