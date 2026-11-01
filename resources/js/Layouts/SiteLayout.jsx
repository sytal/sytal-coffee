import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SmoothScroll from '@/Components/motion/SmoothScroll';

export default function SiteLayout({ children }) {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-brand-background font-sans text-brand-foreground">
                <Navbar />
                <main>{children}</main>
                <Footer />
            </div>
        </SmoothScroll>
    );
}
