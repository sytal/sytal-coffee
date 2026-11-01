import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function SiteLayout({ children }) {
    return (
        <div className="min-h-screen bg-brand-background font-sans text-brand-foreground">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
