import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import {
    LuCalendarCheck,
    LuCircleCheck,
    LuUser,
    LuMail,
    LuPhone,
    LuMessageSquareHeart,
    LuUsers,
    LuCalendar,
    LuClock,
} from 'react-icons/lu';
import KineticText from '@/Components/motion/KineticText';
import FloatingField from '@/Components/FloatingField';
import { playUiSound } from '@/lib/uiSound';
import { useBusiness, formatSlot } from '@/lib/business';

const PARTY_SIZES = Array.from({ length: 10 }, (_, i) => i + 1);

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    party_size: 2,
    requests: '',
};

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

// "2026-11-20" + "19:30" -> "Fri, 20 Nov 2026 at 7:30 PM"
function formatBooking(date, time) {
    const when = new Date(`${date}T${time || '00:00'}`);
    if (Number.isNaN(when.getTime())) return `${date} at ${time}`;
    const day = when.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const clock = when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${day} at ${clock}`;
}

export default function Reservations({
    eyebrow = 'Save Your Seat',
    heading = 'Reserve a Table',
    intro = "Claim your table before the kitchen runs out of today's cravings. We hold reservations for fifteen minutes past the booked time.",
    image = '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
    panelEyebrow = 'Reserved for the Hungry',
    panelHeading = 'A table worth craving.',
}) {
    const { data: form, setData, post, errors, processing, reset, clearErrors } = useForm(EMPTY_FORM);
    const { time_slots: slots = [], open_time: openTime = '13:00' } = useBusiness();

    // Only fixed slots within opening hours; for today, hide times that
    // have already passed (after-midnight slots still belong to tonight).
    function slotsFor(date) {
        const now = new Date();
        const today = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
        if (date !== today) return slots;
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const openMin = Number(openTime.split(':')[0]) * 60;
        return slots.filter((t) => {
            const [h, m] = t.split(':').map(Number);
            const min = h * 60 + m;
            return min < openMin ? nowMin >= openMin || nowMin < min : min > nowMin;
        });
    }
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

    const panelGlow = useMotionTemplate`radial-gradient(260px circle at ${springX}% ${springY}%, rgba(244, 105, 31, 0.22), transparent 70%)`;

    // Clear a field's error as soon as the visitor edits it.
    const update = (field) => (e) => {
        setData(field, e.target.value);
        clearErrors(field);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reservations', {
            preserveScroll: true,
            onSuccess: () => {
                playUiSound('success');
                setSubmitted(true);
            },
        });
    };

    const handleReset = () => {
        reset();
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
                        {eyebrow}
                    </p>
                    <KineticText
                        as="h2"
                        text={heading}
                        className="font-display text-4xl text-brand-foreground sm:text-5xl"
                        stagger={0.1}
                        duration={0.9}
                    />
                    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-foregroundMuted">
                        {intro}
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
                            src={image}
                            alt="A table set for reservations at KAVO"
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-background/85 via-brand-background/10 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-8">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                                {panelEyebrow}
                            </p>
                            <p className="mt-3 font-display text-2xl text-brand-foreground">
                                {panelHeading}
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
                                Your Table Is Saved
                            </h3>
                            <p className="max-w-sm leading-relaxed text-brand-foregroundMuted">
                                Thank you, {form.name.split(' ')[0] || 'friend'}. We&rsquo;ve
                                saved your spot for {form.party_size}{' '}
                                {Number(form.party_size) === 1 ? 'guest' : 'guests'} on{' '}
                                {formatBooking(form.date, form.time)}. Come hungry &mdash; a confirmation
                                is on its way to your inbox.
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
                                <FloatingField
                                    label="Who's joining the feast?"
                                    icon={LuUser}
                                    type="text"
                                    value={form.name}
                                    onChange={update('name')}
                                    error={errors.name}
                                    valid={form.name.trim().length > 0}
                                />

                                <FloatingField
                                    label="Email (optional)"
                                    icon={LuMail}
                                    type="email"
                                    value={form.email}
                                    onChange={update('email')}
                                    error={errors.email}
                                    valid={isValidEmail(form.email)}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <FloatingField
                                    label="Best number to reach you"
                                    icon={LuPhone}
                                    type="tel"
                                    value={form.phone}
                                    onChange={update('phone')}
                                    error={errors.phone}
                                    valid={form.phone.trim().length > 0}
                                />

                                <FloatingField
                                    label="Party Size"
                                    icon={LuUsers}
                                    as="select"
                                    alwaysFloated
                                    value={form.party_size}
                                    onChange={update('party_size')}
                                    error={errors.party_size}
                                >
                                    {PARTY_SIZES.map((size) => (
                                        <option key={size} value={size}>
                                            {size} {size === 1 ? 'Guest' : 'Guests'}
                                        </option>
                                    ))}
                                </FloatingField>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <FloatingField
                                    label="Date"
                                    icon={LuCalendar}
                                    alwaysFloated
                                    type="date"
                                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                                    value={form.date}
                                    onChange={update('date')}
                                    error={errors.date}
                                />

                                <FloatingField
                                    label="Time"
                                    icon={LuClock}
                                    alwaysFloated
                                    as="select"
                                    value={form.time}
                                    onChange={update('time')}
                                    error={errors.time}
                                >
                                    <option value="">Pick a time</option>
                                    {slotsFor(form.date).map((t) => (
                                        <option key={t} value={t}>
                                            {formatSlot(t)}
                                        </option>
                                    ))}
                                </FloatingField>
                            </div>

                            <FloatingField
                                label="Cravings, allergies, or a celebration we should know about?"
                                icon={LuMessageSquareHeart}
                                as="textarea"
                                rows={3}
                                value={form.requests}
                                onChange={update('requests')}
                                maxLength={500}
                                error={errors.requests}
                                className="resize-none"
                            />

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 bg-brand-gold px-8 py-3 text-sm uppercase tracking-wider text-brand-background transition-all duration-300 hover:scale-[1.02] hover:bg-brand-goldLight hover:shadow-lg hover:shadow-brand-gold/20 active:scale-[0.98] disabled:opacity-60"
                            >
                                <LuCalendarCheck className="h-4 w-4" />
                                {processing ? 'Saving…' : 'Save My Table'}
                            </button>
                        </form>
                    )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
