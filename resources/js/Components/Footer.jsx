export default function Footer() {
    return (
        <footer className="border-t border-brand-border/60 bg-brand-surface py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
                <p className="font-display text-xl text-brand-foreground">
                    Sytal <span className="text-brand-gold">Coffee</span>
                </p>
                <p className="text-sm text-brand-foregroundMuted">
                    &copy; {new Date().getFullYear()} Sytal Coffee. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
