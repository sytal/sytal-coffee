import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Hero from '@/Components/Hero';

export default function Home() {
    return (
        <SiteLayout>
            <Head title="Sytal Coffee — Fine Dining & Coffee House" />
            <Hero />
        </SiteLayout>
    );
}
