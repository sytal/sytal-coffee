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
            <Head title="Crunches Cafe — Fast Food & Hangout Spot in Faisalabad" />
            <div id="home">
                <Hero />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-background" />
            <div id="menu">
                <Menu />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <Gallery />
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="about">
                <About />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <div id="reservations">
                <Reservations />
            </div>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="contact">
                <Contact />
            </div>
        </SiteLayout>
    );
}
