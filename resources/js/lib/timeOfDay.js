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

export function getOpenStatus(date = new Date()) {
    // Normalize hours after midnight (0–1am) onto the same 24+ scale as
    // CLOSE_HOUR=25, so "open until 1am" doesn't wrap around to "closed".
    let hour = date.getHours() + date.getMinutes() / 60;
    if (hour < OPEN_HOUR) hour += 24;
    const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    return {
        isOpen,
        label: isOpen
            ? `Open Now · Closes ${formatHour(CLOSE_HOUR)}`
            : `Closed · Opens ${formatHour(OPEN_HOUR)}`,
    };
}

function formatHour(hour24) {
    const normalized = hour24 % 24; // CLOSE_HOUR=25 means "1am"
    const period = normalized >= 12 ? 'PM' : 'AM';
    const hour12 = normalized % 12 === 0 ? 12 : normalized % 12;
    return `${hour12}:00 ${period}`;
}
