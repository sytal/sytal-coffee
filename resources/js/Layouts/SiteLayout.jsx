import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SmoothScroll from '@/Components/motion/SmoothScroll';
import TopProgressBar from '@/Components/motion/TopProgressBar';
import ScrollProgressDot from '@/Components/motion/ScrollProgressDot';
import BackgroundMorph from '@/Components/motion/BackgroundMorph';
import CoffeeMascot from '@/Components/motion/CoffeeMascot';

export default function SiteLayout({ children }) {
    return (
        <SmoothScroll>
            <BackgroundMorph />
            <TopProgressBar />
            <div className="relative z-10 min-h-screen bg-brand-background font-sans text-brand-foreground">
                <Navbar />
                <main>{children}</main>
                <Footer />
            </div>
            <ScrollProgressDot />
            <CoffeeMascot />
        </SmoothScroll>
    );
}
