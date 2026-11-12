<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') · Crunches Cafe</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <style>
        :root { --bg: #faf3e6; --surface: #f2e3c6; --fg: #2b2118; --muted: #6b5a48; --accent: #b3541e; }
        @media (prefers-color-scheme: dark) {
            :root { --bg: #14100c; --surface: #1f1913; --fg: #f3e9da; --muted: #b8a68f; --accent: #e08a4a; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px;
               background: var(--bg); color: var(--fg); font-family: Georgia, 'Times New Roman', serif; }
        main { max-width: 480px; text-align: center; }
        .code { font-size: 72px; line-height: 1; color: var(--accent); margin: 0; }
        h1 { font-size: 28px; margin: 16px 0 8px; font-weight: 500; }
        p { color: var(--muted); font-family: system-ui, sans-serif; line-height: 1.6; margin: 0 0 28px; }
        .brand { font-size: 20px; margin-bottom: 40px; display: block; color: var(--fg); text-decoration: none; }
        .brand span { color: var(--accent); }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        a.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: 999px;
                font-family: system-ui, sans-serif; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
                text-decoration: none; border: 1px solid var(--accent); color: var(--accent); }
        a.btn.primary { background: var(--accent); color: var(--bg); }
    </style>
</head>
<body>
<main>
    <a class="brand" href="/">Crunches <span>Cafe</span></a>
    <p class="code">@yield('code')</p>
    <h1>@yield('heading')</h1>
    <p>@yield('message')</p>
    <div class="actions">
        <a class="btn primary" href="/">Back to home</a>
        <a class="btn" href="/#menu">View the menu</a>
    </div>
</main>
</body>
</html>
