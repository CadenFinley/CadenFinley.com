document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Caden Finley`;
});
