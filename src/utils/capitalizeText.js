export function capitalizeText(text) {
    if (typeof text !== 'string') {
        return '';
    }
    
    return text
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}
