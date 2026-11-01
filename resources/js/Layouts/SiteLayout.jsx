import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SmoothScroll from '@/Components/motion/SmoothScroll';
import TopProgressBar from '@/Components/motion/TopProgressBar';
import ScrollProgressDot from '@/Components/motion/ScrollProgressDot';

export default function SiteLayout({ children }) {
    return (
        <SmoothScroll>
            <TopProgressBar />
            <div className="min-h-screen bg-brand-background font-sans text-brand-foreground">
                <Navbar />
                <main>{children}</main>
                <Footer />
            </div>
            <ScrollProgressDot />
        </SmoothScroll>
    );
}
