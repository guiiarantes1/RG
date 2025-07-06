const formatRelativeDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 60 * 60;
    const secondsInDay = 24 * 60 * 60;
    const secondsInMonth = 30 * 24 * 60 * 60;
    const secondsInYear = 365 * 24 * 60 * 60;

    if (diffInSeconds < secondsInMinute) {
        return `${Math.floor(diffInSeconds)} segundo${Math.floor(diffInSeconds) !== 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes} minuto${minutes !== 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours} hora${hours !== 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < secondsInMonth) {
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days} dia${days !== 1 ? 's' : ''} atrás`;
    } else if (diffInSeconds < secondsInYear) {
        const months = Math.floor(diffInSeconds / secondsInMonth);
        return `${months} mês${months !== 1 ? 'es' : ''} atrás`;
    } else {
        const years = Math.floor(diffInSeconds / secondsInYear);
        return `${years} ano${years !== 1 ? 's' : ''} atrás`;
    }
};

export default formatRelativeDate;
