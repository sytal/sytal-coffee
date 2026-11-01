import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Hero from '@/Components/Hero';
import Menu from '@/Components/Menu';
import Gallery from '@/Components/Gallery';
import About from '@/Components/About';
import Reservations from '@/Components/Reservations';
import Contact from '@/Components/Contact';

export default function Home() {
    return (
        <SiteLayout>
            <Head title="Sytal Coffee — Fine Dining & Coffee House" />
            <Hero />
            <Menu />
            <Gallery />
            <About />
            <Reservations />
            <Contact />
        </SiteLayout>
    );
}
