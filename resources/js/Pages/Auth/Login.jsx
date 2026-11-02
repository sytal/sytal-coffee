import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-background px-6 font-sans text-brand-foreground">
            <Head title="Admin Login" />
            <div className="w-full max-w-sm rounded-sm border border-brand-border bg-brand-surface p-8">
                <h1 className="mb-1 font-display text-2xl text-brand-foreground">
                    Crunches <span className="text-brand-gold">Admin</span>
                </h1>
                <p className="mb-6 text-sm text-brand-foregroundMuted">Sign in to manage the cafe.</p>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-brand-foregroundMuted">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                            autoFocus
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

                    <label className="flex items-center gap-2 text-xs text-brand-foregroundMuted">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Remember me
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 rounded-sm bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-background transition disabled:opacity-60"
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}
