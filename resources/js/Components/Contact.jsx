import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LuMapPin,
    LuPhone,
    LuClock,
    LuSend,
    LuCircleCheck,
} from 'react-icons/lu';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const EMPTY_FORM = { name: '', email: '', message: '' };

const CONTACT_INFO = [
    {
        icon: LuMapPin,
        label: 'Address',
        value: '128 Amber Lane, Downtown District',
    },
    {
        icon: LuPhone,
        label: 'Phone',
        value: '+1 (555) 982-4471',
    },
    {
        icon: LuClock,
        label: 'Hours',
        value: 'Tue–Sun, 8am – 11pm',
    },
];

const SOCIAL_LINKS = [
    { icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: FiFacebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: FiTwitter, label: 'Twitter', href: 'https://twitter.com' },
];

const inputClasses =
    'w-full rounded-sm border border-brand-border bg-brand-surface px-4 py-3 text-brand-foreground placeholder:text-brand-foregroundMuted/50 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40';

export default function Contact() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const update = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Name is required';
        if (!form.email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
        if (!form.message.trim()) next.message = 'Message is required';
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
                        Get in Touch
                    </p>
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        Contact Us
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-brand-foregroundMuted">
                        Questions, private events, or feedback — we&rsquo;d love to hear
                        from you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-2"
                    >
                        <div className="space-y-8">
                            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-brand-foreground">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-4 border-t border-brand-border pt-8">
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
                        </div>
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
                                    Message Sent
                                </h3>
                                <p className="max-w-sm leading-relaxed text-brand-foregroundMuted">
                                    Thank you, {form.name.split(' ')[0] || 'friend'}. We&rsquo;ll
                                    get back to you shortly.
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
                                    <label className="block">
                                        <span className="mb-2 block text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                            Name
                                        </span>
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
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                            Email
                                        </span>
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
                                    </label>
                                </div>

                                <label className="block">
                                    <span className="mb-2 block text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                        Message
                                    </span>
                                    <textarea
                                        value={form.message}
                                        onChange={update('message')}
                                        rows={5}
                                        className={inputClasses}
                                        placeholder="How can we help?"
                                    />
                                    {errors.message && (
                                        <span className="mt-1 block text-xs text-brand-danger">
                                            {errors.message}
                                        </span>
                                    )}
                                </label>

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 bg-brand-gold px-8 py-3 text-sm uppercase tracking-wider text-brand-background transition-all duration-300 hover:scale-[1.02] hover:bg-brand-goldLight hover:shadow-lg hover:shadow-brand-gold/20 active:scale-[0.98] sm:w-auto"
                                >
                                    <LuSend className="h-4 w-4" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
