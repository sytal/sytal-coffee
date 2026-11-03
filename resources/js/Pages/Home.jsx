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

export default function Home({ menuItems = [], menuCategories = [], galleryImages = [], contentBlocks = {} }) {
    const hero = contentBlocks.hero?.fields ?? {};
    const about = contentBlocks.about?.fields ?? {};
    const craveBreak = contentBlocks.crave_break?.fields ?? {};
    const reservationsBanner = contentBlocks.reservations_banner?.fields ?? {};

    return (
        <SiteLayout>
            <Head title="Crunches Cafe — Fast Food & Hangout Spot in Faisalabad" />
            <div id="home">
                <Hero
                    eyebrow={hero.eyebrow}
                    title={hero.title}
                    subtitle={hero.subtitle}
                    ctaLabel={hero.cta_label}
                    secondaryLabel={hero.secondary_label}
                    images={hero.images}
                />
            </div>
            <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
            <ScrollScaleSection>
                <CraveBreak
                    eyebrow={craveBreak.eyebrow}
                    heading={craveBreak.heading}
                    items={craveBreak.items}
                />
            </ScrollScaleSection>
            <SectionDivider fromClass="from-brand-surface" toClass="to-brand-background" />
            <div id="about">
                <ScrollScaleSection>
                    <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                        <About
                            eyebrow={about.eyebrow}
                            heading={about.heading}
                            quote={about.quote}
                            body={about.body}
                            image={about.image}
                        />
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
                    <Reservations
                        eyebrow={reservationsBanner.eyebrow}
                        heading={reservationsBanner.heading}
                        intro={reservationsBanner.intro}
                        image={reservationsBanner.image}
                        panelEyebrow={reservationsBanner.panel_eyebrow}
                        panelHeading={reservationsBanner.panel_heading}
                    />
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
