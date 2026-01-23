export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
};

export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

export const isValidAddress = (address) => {
    return address && address.trim().length > 10;
};
