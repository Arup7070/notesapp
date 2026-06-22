export const validateEmail = (eamil) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(eamil);
}

export const getInitials = (name) => {
    const words = name.split(' ');
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2);i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
}