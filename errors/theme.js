let savedTheme;
try {
  savedTheme = localStorage.getItem('theme');
} catch {
  // Use the system theme when storage is unavailable.
}
document.documentElement.dataset.theme = savedTheme === 'dark' || savedTheme === 'light' ?
    savedTheme : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
