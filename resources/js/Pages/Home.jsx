import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import Hero from '@/Components/Hero';
import Menu from '@/Components/Menu';
import SectionDivider from '@/Components/SectionDivider';
import CraveBreak from '@/Components/CraveBreak';

// Below-the-fold sections are code-split so the initial page load only
// pays for Hero/CraveBreak/Menu — the rest streams in as the user scrolls.
const Gallery = lazy(() => import('@/Components/Gallery'));
const About = lazy(() => import('@/Components/About'));
const Reservations = lazy(() => import('@/Components/Reservations'));
const Contact = lazy(() => import('@/Components/Contact'));

export default function Home() {
    return (
        <SiteLayout>
            <Head title="Crunches Cafe — Fast Food & Hangout Spot in Faisalabad" />
            <div id="home">
                <Hero />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <CraveBreak />
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="menu">
                <Menu />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <Suspense fallback={<div className="h-screen bg-brand-surface" />}>
                <Gallery />
            </Suspense>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="about">
                <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                    <About />
                </Suspense>
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <div id="reservations">
                <Suspense fallback={<div className="h-screen bg-brand-surface" />}>
                    <Reservations />
                </Suspense>
            </div>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="contact">
                <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                    <Contact />
                </Suspense>
            </div>
        </SiteLayout>
    );
}
