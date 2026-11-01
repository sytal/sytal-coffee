import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { LuCalendarCheck, LuCircleCheck } from 'react-icons/lu';
import KineticText from '@/Components/motion/KineticText';

const PARTY_SIZES = Array.from({ length: 10 }, (_, i) => i + 1);

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: 2,
    requests: '',
};

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-wider text-brand-foregroundMuted">
                {label}
            </span>
            {children}
        </label>
    );
}

const inputClasses =
    'w-full rounded-sm border border-brand-border bg-brand-surface px-4 py-3 text-brand-foreground placeholder:text-brand-foregroundMuted/50 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40';

export default function Reservations() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const panelRef = useRef(null);
    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);
    const springX = useSpring(glowX, { stiffness: 150, damping: 20 });
    const springY = useSpring(glowY, { stiffness: 150, damping: 20 });

    const handlePanelMouseMove = (e) => {
        const rect = panelRef.current?.getBoundingClientRect();
        if (!rect) return;
        glowX.set(((e.clientX - rect.left) / rect.width) * 100);
        glowY.set(((e.clientY - rect.top) / rect.height) * 100);
    };

    // Brand gold (#cda45e) expressed as rgba for a translucent cursor-follow glow.
    const panelGlow = useMotionTemplate`radial-gradient(260px circle at ${springX}% ${springY}%, rgba(205, 164, 94, 0.22), transparent 70%)`;

    const update = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Name is required';
        if (!form.email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
        if (!form.phone.trim()) next.phone = 'Phone number is required';
        if (!form.date) next.date = 'Select a date';
        if (!form.time) next.time = 'Select a time';
        return next;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setSubmitted(true);
        }
    };

    const handleReset = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitted(false);
    };

    return (
        <section className="bg-brand-surface py-24 sm:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 text-center"
                >
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Book Your Table
                    </p>
                    <KineticText
                        as="h2"
                        text="Reservations"
                        className="font-display text-4xl text-brand-foreground sm:text-5xl"
                        stagger={0.1}
                        duration={0.9}
                    />
                    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-foregroundMuted">
                        Reserve your evening with us. We hold tables for fifteen minutes
                        past the booked time.
                    </p>
                </motion.div>

                <div className="grid items-stretch gap-8 lg:grid-cols-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        onMouseMove={handlePanelMouseMove}
                        ref={panelRef}
                        className="relative hidden min-h-[520px] overflow-hidden rounded-sm border border-brand-border lg:col-span-2 lg:block"
                    >
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-10"
                            style={{ background: panelGlow }}
                        />
                        <img
                            src="/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg"
                            alt="A table set for reservations at Sytal Coffee"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-background/85 via-brand-background/10 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-8">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                                Every Table, Considered
                            </p>
                            <p className="mt-3 font-display text-2xl text-brand-foreground">
                                An evening worth the wait.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="rounded-sm border border-brand-border bg-brand-surfaceAlt p-8 sm:p-10 lg:col-span-3"
                    >
                    {submitted ? (
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <LuCircleCheck className="h-12 w-12 text-brand-success" />
                            <h3 className="font-display text-2xl text-brand-foreground">
                                Reservation Requested
                            </h3>
                            <p className="max-w-sm leading-relaxed text-brand-foregroundMuted">
                                Thank you, {form.name.split(' ')[0] || 'friend'}. We&rsquo;ve
                                noted your request for {form.partySize}{' '}
                                {Number(form.partySize) === 1 ? 'guest' : 'guests'} on{' '}
                                {form.date} at {form.time}. A confirmation will follow by
                                email shortly.
                            </p>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="mt-2 border border-brand-gold px-6 py-2 text-sm uppercase tracking-wider text-brand-gold transition-all duration-300 hover:scale-[1.02] hover:bg-brand-gold hover:text-brand-background active:scale-[0.98]"
                            >
                                Book Another Table
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field label="Full Name">
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={update('name')}
                                        className={inputClasses}
                                        placeholder="Jane Doe"
                                    />
                                    {errors.name && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.name}
                                        </span>
                                    )}
                                </Field>

                                <Field label="Email">
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={update('email')}
                                        className={inputClasses}
                                        placeholder="jane@example.com"
                                    />
                                    {errors.email && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.email}
                                        </span>
                                    )}
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field label="Phone">
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={update('phone')}
                                        className={inputClasses}
                                        placeholder="(555) 123-4567"
                                    />
                                    {errors.phone && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.phone}
                                        </span>
                                    )}
                                </Field>

                                <Field label="Party Size">
                                    <select
                                        value={form.partySize}
                                        onChange={update('partySize')}
                                        className={inputClasses}
                                    >
                                        {PARTY_SIZES.map((size) => (
                                            <option key={size} value={size}>
                                                {size} {size === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Field label="Date">
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={update('date')}
                                        className={inputClasses}
                                    />
                                    {errors.date && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.date}
                                        </span>
                                    )}
                                </Field>

                                <Field label="Time">
                                    <input
                                        type="time"
                                        value={form.time}
                                        onChange={update('time')}
                                        className={inputClasses}
                                    />
                                    {errors.time && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.time}
                                        </span>
                                    )}
                                </Field>
                            </div>

                            <Field label="Special Requests (optional)">
                                <textarea
                                    value={form.requests}
                                    onChange={update('requests')}
                                    rows={4}
                                    className={inputClasses}
                                    placeholder="Allergies, celebrations, seating preferences…"
                                />
                            </Field>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 bg-brand-gold px-8 py-3 text-sm uppercase tracking-wider text-brand-background transition-all duration-300 hover:scale-[1.02] hover:bg-brand-goldLight hover:shadow-lg hover:shadow-brand-gold/20 active:scale-[0.98]"
                            >
                                <LuCalendarCheck className="h-4 w-4" />
                                Request Reservation
                            </button>
                        </form>
                    )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
