export const getInitials = (name:string) => {
    const parts = name.split(' ');
    return parts.map(part => part[0].toUpperCase()).join('');
}