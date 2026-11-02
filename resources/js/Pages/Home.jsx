import { Head } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import Hero from '@/Components/Hero';
import Menu from '@/Components/Menu';
import SectionDivider from '@/Components/SectionDivider';
import CraveBreak from '@/Components/CraveBreak';
import { ScrollScaleSection } from '@/Components/motion/ScrollScale';

// Below-the-fold sections are code-split so the initial page load only
// pays for Hero/CraveBreak/Menu — the rest streams in as the user scrolls.
const Gallery = lazy(() => import('@/Components/Gallery'));
const About = lazy(() => import('@/Components/About'));
const Reservations = lazy(() => import('@/Components/Reservations'));
const Contact = lazy(() => import('@/Components/Contact'));

export default function Home({ menuItems = [], menuCategories = [], galleryImages = [] }) {
    return (
        <SiteLayout>
            <Head title="Crunches Cafe — Fast Food & Hangout Spot in Faisalabad" />
            <div id="home">
                <Hero />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <ScrollScaleSection>
                <CraveBreak />
            </ScrollScaleSection>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="about">
                <ScrollScaleSection>
                    <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                        <About />
                    </Suspense>
                </ScrollScaleSection>
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-background" />
            <div id="menu">
                <Menu menuItems={menuItems} menuCategories={menuCategories} />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <Suspense fallback={<div className="h-screen bg-brand-surface" />}>
                <Gallery galleryImages={galleryImages} />
            </Suspense>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-surface" />
            <div id="reservations">
                <Suspense fallback={<div className="h-screen bg-brand-surface" />}>
                    <Reservations />
                </Suspense>
            </div>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="contact">
                <ScrollScaleSection>
                    <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                        <Contact />
                    </Suspense>
                </ScrollScaleSection>
            </div>
        </SiteLayout>
    );
}
