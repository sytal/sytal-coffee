let audioCtx = null;
let muted = typeof window !== 'undefined' && localStorage.getItem('sytal-sound-muted') === 'true';

function getCtx() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
    }
    return audioCtx;
}

const FREQUENCIES = { click: 560, hover: 780, success: 900 };

/** Synthesized UI sound — no audio assets needed, just a soft sine blip. */
export function playUiSound(type = 'click') {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(FREQUENCIES[type] ?? FREQUENCIES.click, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.start(now);
    osc.stop(now + 0.18);
}

export function isUiSoundMuted() {
    return muted;
}

export function toggleUiSound() {
    muted = !muted;
    if (typeof window !== 'undefined') localStorage.setItem('sytal-sound-muted', String(muted));
    return muted;
}
