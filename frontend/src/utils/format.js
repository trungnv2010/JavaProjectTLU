export const formatCurrency = (amount, currency = 'VND') => {

    if (typeof amount !== 'number' || isNaN(amount)) {
        return '0 VND';
    }


    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return formatter.format(amount);
};


export const formatDate = (date) => {
    if (!date) return '';

    const dateObj = new Date(date);


    if (isNaN(dateObj.getTime())) {
        return '';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
};


export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + '...';
};


export const formatNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0';
    }

    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(1) + 'K';
    } else {
        return (number / 1000000).toFixed(1) + 'M';
    }
};