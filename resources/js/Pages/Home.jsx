import { Head } from '@inertiajs/react';
import { Fragment, lazy, Suspense } from 'react';
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

// Each homepage block knows its background so the gradient divider between
// two neighbours can blend one into the other whatever order they end up in.
// (Whole class names only, so Tailwind's JIT can see them.)
const BG = {
    background: { from: 'from-brand-background', to: 'to-brand-background' },
    surface: { from: 'from-brand-surface', to: 'to-brand-surface' },
};

export default function Home({ menuItems = [], menuCategories = [], galleryImages = [], contentBlocks = {} }) {
    const hero = contentBlocks.hero?.fields ?? {};
    const about = contentBlocks.about?.fields ?? {};
    const craveBreak = contentBlocks.crave_break?.fields ?? {};
    const reservationsBanner = contentBlocks.reservations_banner?.fields ?? {};

    const contentSections = {
        hero: {
            bg: BG.background,
            node: (
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
            ),
        },
        crave_break: {
            bg: BG.surface,
            node: (
                <ScrollScaleSection>
                    <CraveBreak eyebrow={craveBreak.eyebrow} heading={craveBreak.heading} items={craveBreak.items} />
                </ScrollScaleSection>
            ),
        },
        about: {
            bg: BG.background,
            node: (
                <div id="about">
                    <ScrollScaleSection>
                        <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                            <About
                                eyebrow={about.eyebrow}
                                heading={about.heading}
                                quote={about.quote}
                                body={about.body}
                                image={about.image}
                                menuCount={menuItems.length}
                            />
                        </Suspense>
                    </ScrollScaleSection>
                </div>
            ),
        },
        reservations_banner: {
            bg: BG.surface,
            node: (
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
            ),
        },
    };

    const menuSection = {
        key: 'menu',
        bg: BG.background,
        node: (
            <div id="menu">
                <Menu menuItems={menuItems} menuCategories={menuCategories} />
            </div>
        ),
    };
    const gallerySection = {
        key: 'gallery',
        bg: BG.surface,
        node: (
            <Suspense fallback={<div className="h-screen bg-brand-surface" />}>
                <Gallery galleryImages={galleryImages} />
            </Suspense>
        ),
    };
    const contactSection = {
        key: 'contact',
        bg: BG.background,
        node: (
            <div id="contact">
                <ScrollScaleSection>
                    <Suspense fallback={<div className="h-screen bg-brand-background" />}>
                        <Contact />
                    </Suspense>
                </ScrollScaleSection>
            </div>
        ),
    };

    // The four admin-editable sections follow the order set in Admin →
    // Website Content (sort_order). Menu + Gallery always sit just before
    // the reservations section, and Contact always closes the page.
    const ordered = Object.keys(contentSections).sort(
        (a, b) => (contentBlocks[a]?.sort_order ?? 99) - (contentBlocks[b]?.sort_order ?? 99)
    );
    const sections = [];
    ordered.forEach((key) => {
        if (key === 'reservations_banner') sections.push(menuSection, gallerySection);
        sections.push({ key, ...contentSections[key] });
    });
    if (!ordered.includes('reservations_banner')) sections.push(menuSection, gallerySection);
    sections.push(contactSection);

    return (
        <SiteLayout>
            <Head title="Crunches Cafe — Fast Food & Hangout Spot in Faisalabad" />
            {sections.map((section, i) => (
                <Fragment key={section.key}>
                    {i > 0 && (
                        <SectionDivider fromClass={sections[i - 1].bg.from} toClass={section.bg.to} />
                    )}
                    {section.node}
                </Fragment>
            ))}
        </SiteLayout>
    );
}
