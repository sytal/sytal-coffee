import { motion } from 'framer-motion';

/**
 * Subtle transition strip placed between two sections of different
 * background colors. Blends `from` into `to` with a soft gradient and
 * draws a thin gold line through the middle that fades in on scroll —
 * never a hard edge, never clip-path (Lenis-safe).
 *
 * Usage: <SectionDivider fromClass="from-brand-background" toClass="to-brand-surface" />
 * (Tailwind class names must be passed whole/static so the JIT compiler
 * can detect them — do not build them with string interpolation.)
 */
export default function SectionDivider({
    fromClass = 'from-brand-background',
    toClass = 'to-brand-surface',
}) {
    return (
        <div
            aria-hidden="true"
            className="relative h-16 w-full overflow-hidden sm:h-24"
        >
            <div className={`absolute inset-0 bg-gradient-to-b ${fromClass} ${toClass}`} />
            <motion.div
                initial={{ opacity: 0, scaleX: 0.3 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/2 top-1/2 h-px w-2/3 max-w-xs -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
            />
        </div>
    );
}
