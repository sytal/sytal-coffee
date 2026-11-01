export const OPEN_DAYS = [2, 3, 4, 5, 6, 0]; // Tue(2)–Sun(0), closed Monday(1)
export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 23; // 11pm

export function getTimeOfDay(date = new Date()) {
    const hour = date.getHours();
    if (hour < 5) return { key: 'night', label: 'Good Night' };
    if (hour < 12) return { key: 'morning', label: 'Good Morning' };
    if (hour < 17) return { key: 'afternoon', label: 'Good Afternoon' };
    if (hour < 21) return { key: 'evening', label: 'Good Evening' };
    return { key: 'night', label: 'Good Night' };
}

export function getOpenStatus(date = new Date()) {
    const day = date.getDay();
    const hour = date.getHours() + date.getMinutes() / 60;
    const isOpenDay = OPEN_DAYS.includes(day);
    const isOpen = isOpenDay && hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    return {
        isOpen,
        label: isOpen
            ? `Open Now · Closes ${formatHour(CLOSE_HOUR)}`
            : `Closed · Opens ${formatHour(OPEN_HOUR)}`,
    };
}

function formatHour(hour24) {
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:00 ${period}`;
}
