import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-background px-6 font-sans text-brand-foreground">
            <Head title="Create Account — Crunches Cafe" />
            <div className="w-full max-w-sm rounded-sm border border-brand-border bg-brand-surface p-8">
                <Link href="/" className="mb-1 inline-block font-display text-2xl text-brand-foreground">
                    Crunches <span className="text-brand-gold">Cafe</span>
                </Link>
                <p className="mb-6 text-sm text-brand-foregroundMuted">
                    Create an account to place orders and track your order history.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-brand-foregroundMuted">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                            autoFocus
                        />
                        {errors.name && <p className="mt-1 text-xs text-brand-danger">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-brand-foregroundMuted">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                        />
                        {errors.email && <p className="mt-1 text-xs text-brand-danger">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-brand-foregroundMuted">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                        />
                        {errors.password && <p className="mt-1 text-xs text-brand-danger">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-brand-foregroundMuted">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 rounded-sm bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-background transition disabled:opacity-60"
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-5 text-center text-xs text-brand-foregroundMuted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-gold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
