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

function playSizzle(ctx) {
    const duration = 0.25;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3200;
    bandpass.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
}

/** Synthesized UI sound — no audio assets needed, just a soft sine blip (or a noise-burst "sizzle"). */
export function playUiSound(type = 'click') {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'sizzle') {
        playSizzle(ctx);
        return;
    }

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
