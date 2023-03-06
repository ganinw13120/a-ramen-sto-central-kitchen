export const formatDate = (val : string) => {
    const date = new Date(val);
    return `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(2, '0')}`;
}
export const formatDateTime = (val : string) => {
    const date = new Date(val);
    return `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(2, '0')} : ${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')} น.`;
}
export const formatMomentDate = (val : string) => {
    const date = new Date(val);
    return `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().padStart(2, '0')}`;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatDateWithStringMonth = (val : string) => {
    const date = new Date(val);
    return `${(date.getDate()).toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear().toString().padStart(2, '0')}`;
}

export const formatTime = (val : string) => {
    const date = new Date(val);
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    return `${hours}:${date.getMinutes().toString().padStart(2, '0')} ${ampm}`;
}