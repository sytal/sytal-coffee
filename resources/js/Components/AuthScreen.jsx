import { Head, Link, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { LuLock, LuMail, LuPhone, LuUser } from 'react-icons/lu';
import FloatingField from '@/Components/FloatingField';

/**
 * Combined Login + Register screen. Both routes (`/login`, `/register`)
 * render this same component with a different `initialMode`, so switching
 * between them first plays a local slide/crossfade animation and only then
 * navigates — giving the illusion of one continuous split-screen panel that
 * swaps sides, instead of a hard page reload cutting the transition short.
 */

const IMAGES = {
    login: {
        src: '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
        caption: 'Crafted plates. Quiet evenings.',
    },
    register: {
        src: '/images/chef-preparing-the-plates.jpg',
        caption: 'Join the table.',
    },
};

// Wavy divider instead of a straight diagonal: a gentle S-curve from
// top-right down to bottom-left, defined once in a 0-1 "object bounding
// box" coordinate space via an SVG <clipPath> so it scales with the card's
// actual size. The curve stays within a narrow 54%-66% band across the
// whole height so it never swings out far enough to cross under the form
// text, which sits further out at pl-24/pr-24.
const WAVE_CLIP_PATH_RIGHT = 'url(#auth-wave-right)';
const WAVE_CLIP_PATH_LEFT = 'url(#auth-wave-left)';
// The curve itself: top anchor (0.6, 0) down to bottom anchor (0.52, 1),
// bowing out to ~0.68 and back in to ~0.46 along the way for the S-wave.
const WAVE_CURVE = 'C0.68,0.22 0.52,0.4 0.6,0.5 C0.68,0.6 0.46,0.78 0.52,1';
const WAVE_RIGHT_D = `M0.6,0 ${WAVE_CURVE} L1,1 L1,0 Z`;
const WAVE_LEFT_D = `M0,0 L0.6,0 ${WAVE_CURVE} L0,1 Z`;
const WAVE_LINE_D = `M0.6,0 ${WAVE_CURVE}`;

const panelVariants = {
    initial: (fromSide) => ({ opacity: 0, x: fromSide === 'left' ? -40 : 40 }),
    animate: { opacity: 1, x: 0 },
    exit: (toSide) => ({ opacity: 0, x: toSide === 'left' ? -40 : 40 }),
};

export default function AuthScreen({ initialMode }) {
    const [mode, setMode] = useState(initialMode);
    const isLogin = mode === 'login';

    const loginForm = useForm({ email: '', password: '', remember: false });
    const registerForm = useForm({ name: '', email: '', phone: '03', password: '' });

    function submitLogin(e) {
        e.preventDefault();
        loginForm.post('/login');
    }

    function submitRegister(e) {
        e.preventDefault();
        registerForm.post('/register');
    }

    function switchTo(nextMode) {
        if (nextMode === mode) return;
        setMode(nextMode);
        // Let the swap animation play before swapping the actual URL so the
        // browser history/bookmark stays correct, without a jarring reload.
        window.setTimeout(() => {
            router.visit(nextMode === 'login' ? '/login' : '/register', {
                replace: true,
                preserveState: true,
                preserveScroll: true,
            });
        }, 420);
    }

    const image = isLogin ? IMAGES.login : IMAGES.register;
    // Image sits on the right when signing in, left when registering — the
    // panel that swaps sides each time the mode toggles.
    const imageSide = isLogin ? 'right' : 'left';
    const formSide = isLogin ? 'left' : 'right';

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-background px-4 py-10 font-sans text-brand-foreground sm:px-6">
            <Head title={isLogin ? 'Sign In — Crunches Cafe' : 'Create Account — Crunches Cafe'} />

            <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-brand-border bg-brand-surface shadow-2xl shadow-black/40">
                {/* Mobile: simple stacked layout, no diagonal clip. */}
                <div className="flex flex-col md:hidden">
                    <div className="relative h-40 w-full overflow-hidden sm:h-52">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={image.src}
                                src={image.src}
                                alt=""
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="h-full w-full object-cover"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/20 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                            <p className="font-display text-lg text-brand-foreground">
                                Crunches <span className="text-brand-gold">Cafe</span>
                            </p>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <LoginFormPanel key="login-m" idPrefix="login-m" form={loginForm} onSubmit={submitLogin} onSwitch={() => switchTo('register')} />
                            ) : (
                                <RegisterFormPanel key="register-m" idPrefix="register-m" form={registerForm} onSubmit={submitRegister} onSwitch={() => switchTo('login')} />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Desktop/tablet: diagonal split, two panels that swap sides.
                    The divider line itself is fixed in space — top edge further
                    right, bottom edge further left (60% -> 48%) — and image vs.
                    form simply swap which side of that fixed line they occupy,
                    which keeps the "top-right to bottom-left" diagonal readable
                    and consistent as the panels swap. */}
                <div className="relative hidden h-[640px] md:block">
                    {/* clipPathUnits="objectBoundingBox" makes the 0-1 curve
                        coordinates scale with the panel's actual rendered
                        size, so the wave stays proportionally correct at any
                        width between the card's md and max-w-5xl bounds. */}
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <clipPath id="auth-wave-right" clipPathUnits="objectBoundingBox">
                                <path d={WAVE_RIGHT_D} />
                            </clipPath>
                            <clipPath id="auth-wave-left" clipPathUnits="objectBoundingBox">
                                <path d={WAVE_LEFT_D} />
                            </clipPath>
                        </defs>
                    </svg>

                    <AnimatePresence initial={false} custom={imageSide}>
                        <motion.div
                            key={`image-${imageSide}`}
                            custom={imageSide}
                            variants={panelVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0"
                            style={{ clipPath: imageSide === 'right' ? WAVE_CLIP_PATH_RIGHT : WAVE_CLIP_PATH_LEFT }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={image.src}
                                    src={image.src}
                                    alt=""
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="h-full w-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 via-brand-background/10 to-brand-background/20" />
                            <div className={`absolute bottom-10 ${imageSide === 'right' ? 'right-12 text-right' : 'left-12 text-left'} max-w-xs`}>
                                <p className="font-display text-2xl leading-snug text-brand-foreground">{image.caption}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-gold">Crunches Cafe</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Solid backing behind the form so text always has full
                        contrast, independent of what the photo looks like. */}
                    <motion.div
                        key={`backdrop-${formSide}`}
                        animate={{ clipPath: formSide === 'left' ? WAVE_CLIP_PATH_LEFT : WAVE_CLIP_PATH_RIGHT }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="pointer-events-none absolute inset-0 bg-brand-surface"
                    />

                    {/* Gold seam traced along the same wave, drawn as a
                        stroked SVG path (not a clipped sliver) so it stays a
                        clean, constant-width line through every curve. */}
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="auth-seam-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(244,105,31,0.9)" />
                                <stop offset="100%" stopColor="rgba(244,105,31,0.15)" />
                            </linearGradient>
                        </defs>
                        <path
                            d={WAVE_LINE_D.replace(/[\d.]+/g, (n) => Number(n) * 100)}
                            fill="none"
                            stroke="url(#auth-seam-gradient)"
                            strokeWidth="2.5"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    <AnimatePresence initial={false} custom={formSide}>
                        <motion.div
                            key={`form-${formSide}`}
                            custom={formSide}
                            variants={panelVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className={`absolute inset-y-0 flex w-1/2 items-center ${formSide === 'right' ? 'right-0 justify-start pl-40' : 'left-0 justify-end pr-24'}`}
                        >
                            <div className="w-full max-w-[19rem]">
                                {isLogin ? (
                                    <LoginFormPanel idPrefix="login-d" form={loginForm} onSubmit={submitLogin} onSwitch={() => switchTo('register')} />
                                ) : (
                                    <RegisterFormPanel idPrefix="register-d" form={registerForm} onSubmit={submitRegister} onSwitch={() => switchTo('login')} />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function LoginFormPanel({ form, onSubmit, onSwitch, idPrefix = 'login' }) {
    const { data, setData, processing, errors } = form;
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <Link href="/" className="mb-1 inline-block font-display text-2xl text-brand-foreground">
                Crunches <span className="text-brand-gold">Cafe</span>
            </Link>
            <p className="mb-6 text-sm text-brand-foregroundMuted">
                Sign in to place an order, check your order history, or manage the cafe.
            </p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FloatingField
                    id={`${idPrefix}-email`}
                    label="Email"
                    icon={LuMail}
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) => { setData('email', e.target.value); form.clearErrors('email'); }}
                    error={errors.email}
                    autoFocus
                />
                <FloatingField
                    id={`${idPrefix}-password`}
                    label="Password"
                    icon={LuLock}
                    type="password"
                    placeholder="Your password"
                    value={data.password}
                    onChange={(e) => { setData('password', e.target.value); form.clearErrors('password'); }}
                    error={errors.password}
                />

                <label className="flex items-center gap-2 text-xs text-brand-foregroundMuted">
                    <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    Remember me
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 rounded-full bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-brand-foregroundMuted">
                New here?{' '}
                <button type="button" onClick={onSwitch} className="text-brand-gold hover:underline">
                    Create an account
                </button>
            </p>
        </motion.div>
    );
}

function RegisterFormPanel({ form, onSubmit, onSwitch, idPrefix = 'register' }) {
    const { data, setData, processing, errors } = form;
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <Link href="/" className="mb-1 inline-block font-display text-2xl text-brand-foreground">
                Crunches <span className="text-brand-gold">Cafe</span>
            </Link>
            <p className="mb-6 text-sm text-brand-foregroundMuted">Create an account to place orders and track your order history.</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FloatingField
                    id={`${idPrefix}-name`}
                    label="Name"
                    icon={LuUser}
                    type="text"
                    placeholder="Your full name"
                    value={data.name}
                    onChange={(e) => { setData('name', e.target.value); form.clearErrors('name'); }}
                    error={errors.name}
                    autoFocus
                />
                <FloatingField
                    id={`${idPrefix}-email`}
                    label="Email"
                    icon={LuMail}
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) => { setData('email', e.target.value); form.clearErrors('email'); }}
                    error={errors.email}
                />
                <FloatingField
                    id={`${idPrefix}-phone`}
                    label="Phone"
                    prefix="03"
                    type="tel"
                    inputMode="numeric"
                    placeholder="XX XXXXXXX"
                    maxLength={9}
                    value={data.phone.replace(/^03/, '')}
                    onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                        setData('phone', `03${digits}`);
                        form.clearErrors('phone');
                    }}
                    error={errors.phone}
                />
                <FloatingField
                    id={`${idPrefix}-password`}
                    label="Password"
                    icon={LuLock}
                    type="password"
                    placeholder="At least 8 characters"
                    value={data.password}
                    onChange={(e) => { setData('password', e.target.value); form.clearErrors('password'); }}
                    error={errors.password}
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 rounded-full bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                >
                    {processing ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-brand-foregroundMuted">
                Already have an account?{' '}
                <button type="button" onClick={onSwitch} className="text-brand-gold hover:underline">
                    Sign in
                </button>
            </p>
        </motion.div>
    );
}
