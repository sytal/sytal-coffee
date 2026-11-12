// Matches the stated hours in Footer.jsx/Contact.jsx: "Daily, 1pm–1am".
export const OPEN_HOUR = 13; // 1pm
export const CLOSE_HOUR = 25; // 1am next day, expressed as 24+1 for the hour math below

export function getTimeOfDay(date = new Date()) {
    const hour = date.getHours();
    if (hour < 5) return { key: 'night', label: 'Good Night' };
    if (hour < 12) return { key: 'morning', label: 'Good Morning' };
    if (hour < 17) return { key: 'afternoon', label: 'Good Afternoon' };
    if (hour < 21) return { key: 'evening', label: 'Good Evening' };
    return { key: 'night', label: 'Good Night' };
}

const toHours = (t) => {
    const [h, m] = String(t).split(':').map(Number);
    return h + (m || 0) / 60;
};

// openTime/closeTime are "HH:MM" from Admin > Business Info; closing after
// midnight (e.g. 13:00–01:00) is handled by shifting onto a 24+ scale.
export function getOpenStatus(date = new Date(), openTime = '13:00', closeTime = '01:00') {
    const open = toHours(openTime);
    let close = toHours(closeTime);
    if (close <= open) close += 24;
    let hour = date.getHours() + date.getMinutes() / 60;
    if (hour < open) hour += 24;
    const isOpen = hour >= open && hour < close;

    return {
        isOpen,
        label: isOpen ? `Open Now · Closes ${formatHour(close)}` : `Closed · Opens ${formatHour(open)}`,
    };
}

function formatHour(hours) {
    const h = Math.floor(hours) % 24;
    const m = Math.round((hours % 1) * 60);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
