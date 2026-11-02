<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;

class NewsletterService
{
    public function subscribe(string $email): NewsletterSubscriber
    {
        return NewsletterSubscriber::firstOrCreate(['email' => $email]);
    }
}
