import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import KineticText from '@/Components/motion/KineticText';
import FloatingField from '@/Components/FloatingField';
import { playUiSound } from '@/lib/uiSound';
import {
    LuMapPin,
    LuPhone,
    LuClock,
    LuSend,
    LuCircleCheck,
    LuUser,
    LuMail,
    LuMessageCircle,
} from 'react-icons/lu';
import { useBusiness, socialLinks } from '@/lib/business';

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export default function Contact() {
    const business = useBusiness();
    const CONTACT_INFO = [
        { icon: LuMapPin, label: 'Address', value: business.address },
        business.phone && { icon: LuPhone, label: 'Phone', value: business.phone, href: `tel:${business.phone}` },
        business.email && { icon: LuMail, label: 'Email', value: business.email, href: `mailto:${business.email}` },
        { icon: LuClock, label: 'Hours', value: business.hours_label },
    ].filter(Boolean);
    const SOCIAL_LINKS = socialLinks(business).map(({ Icon, ...rest }) => ({ icon: Icon, ...rest }));
    const { data: form, setData, post, errors, processing, reset, clearErrors } = useForm(EMPTY_FORM);
    const [submitted, setSubmitted] = useState(false);

    const infoRef = useRef(null);
    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);
    const springX = useSpring(glowX, { stiffness: 150, damping: 20 });
    const springY = useSpring(glowY, { stiffness: 150, damping: 20 });
    const infoGlow = useMotionTemplate`radial-gradient(240px circle at ${springX}% ${springY}%, rgba(244, 105, 31, 0.16), transparent 70%)`;

    const handleInfoMouseMove = (e) => {
        const rect = infoRef.current?.getBoundingClientRect();
        if (!rect) return;
        glowX.set(((e.clientX - rect.left) / rect.width) * 100);
        glowY.set(((e.clientY - rect.top) / rect.height) * 100);
    };

    // Clear a field's error as soon as the visitor edits it.
    const update = (field) => (e) => {
        setData(field, e.target.value);
        clearErrors(field);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
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
        <section className="bg-brand-background py-24 sm:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-16 text-center"
                >
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Say Hello
                    </p>
                    <KineticText
                        as="h2"
                        text="Let's Talk"
                        className="font-display text-4xl text-brand-foreground sm:text-5xl"
                        stagger={0.1}
                        duration={0.9}
                    />
                    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-foregroundMuted">
                        Catering, private events, or just telling us how good the fries
                        were — we&rsquo;re all ears.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        onMouseMove={handleInfoMouseMove}
                        ref={infoRef}
                        className="relative lg:col-span-2"
                    >
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
                            style={{ background: infoGlow }}
                        />
                        <div className="space-y-8">
                            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                            {label}
                                        </p>
                                        {href ? (
                                            <a href={href} className="mt-1 block break-all text-brand-foreground hover:text-brand-gold">{value}</a>
                                        ) : (
                                            <p className="mt-1 text-brand-foreground">{value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {SOCIAL_LINKS.length > 0 && <div className="mt-10 flex gap-4 border-t border-brand-border pt-8">
                            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition-all duration-300 hover:scale-110 hover:border-brand-gold hover:text-brand-gold"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="rounded-sm border border-brand-border bg-brand-surfaceAlt p-8 lg:col-span-3"
                    >
                        {submitted ? (
                            <div className="flex flex-col items-center gap-4 py-10 text-center">
                                <LuCircleCheck className="h-12 w-12 text-brand-success" />
                                <h3 className="font-display text-2xl text-brand-foreground">
                                    Message Received
                                </h3>
                                <p className="max-w-sm leading-relaxed text-brand-foregroundMuted">
                                    Thanks, {form.name.split(' ')[0] || 'friend'} — we&rsquo;ll be
                                    in touch soon. In the meantime, maybe start thinking about
                                    what you&rsquo;re ordering.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-2 border border-brand-gold px-6 py-2 text-sm uppercase tracking-wider text-brand-gold transition-all duration-300 hover:scale-[1.02] hover:bg-brand-gold hover:text-brand-background active:scale-[0.98]"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <FloatingField
                                        label="What should we call you?"
                                        icon={LuUser}
                                        type="text"
                                        value={form.name}
                                        onChange={update('name')}
                                        error={errors.name}
                                        valid={form.name.trim().length > 0}
                                    />

                                    <FloatingField
                                        label="Where can we reply?"
                                        icon={LuMail}
                                        type="email"
                                        value={form.email}
                                        onChange={update('email')}
                                        error={errors.email}
                                        valid={isValidEmail(form.email)}
                                    />
                                </div>

                                <FloatingField
                                    label="Phone (optional)"
                                    icon={LuPhone}
                                    type="tel"
                                    value={form.phone}
                                    onChange={update('phone')}
                                    error={errors.phone}
                                    valid={form.phone.trim().length >= 10}
                                />

                                <FloatingField
                                    label="What's on your mind (or your plate wishlist)?"
                                    icon={LuMessageCircle}
                                    as="textarea"
                                    rows={5}
                                    value={form.message}
                                    onChange={update('message')}
                                    error={errors.message}
                                    valid={form.message.trim().length > 0}
                                    className="resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 bg-brand-gold px-8 py-3 text-sm uppercase tracking-wider text-brand-background transition-all duration-300 hover:scale-[1.02] hover:bg-brand-goldLight hover:shadow-lg hover:shadow-brand-gold/20 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                                >
                                    <LuSend className="h-4 w-4" />
                                    {processing ? 'Sending…' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
