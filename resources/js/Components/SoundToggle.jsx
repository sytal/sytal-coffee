import { useState } from 'react';
import { LuVolume2, LuVolumeX } from 'react-icons/lu';
import { isUiSoundMuted, toggleUiSound } from '@/lib/uiSound';

export default function SoundToggle({ className = '' }) {
    const [muted, setMuted] = useState(() => isUiSoundMuted());

    return (
        <button
            type="button"
            onClick={() => setMuted(toggleUiSound())}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            aria-pressed={!muted}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-brand-border/60 text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold ${className}`}
        >
            {muted ? <LuVolumeX className="h-3.5 w-3.5" /> : <LuVolume2 className="h-3.5 w-3.5" />}
        </button>
    );
}
