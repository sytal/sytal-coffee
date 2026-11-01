import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Hero from '@/Components/Hero';
import Menu from '@/Components/Menu';
import Gallery from '@/Components/Gallery';
import About from '@/Components/About';
import Reservations from '@/Components/Reservations';
import Contact from '@/Components/Contact';
import SectionDivider from '@/Components/SectionDivider';

export default function Home() {
    return (
        <SiteLayout>
            <Head title="Sytal Coffee — Fine Dining & Coffee House" />
            <Hero />
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-background" />
            <Menu />
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <Gallery />
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <About />
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <Reservations />
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <Contact />
        </SiteLayout>
    );
}
