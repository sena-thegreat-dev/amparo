const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }
menuButton?.addEventListener('click', () => { const isOpen = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(isOpen)); menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu'); });
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); }));
document.querySelectorAll('.faq-item button').forEach((button) => button.addEventListener('click', () => { const item = button.closest('.faq-item'); const willOpen = !item.classList.contains('open'); document.querySelectorAll('.faq-item').forEach((faq) => { faq.classList.remove('open'); faq.querySelector('button').setAttribute('aria-expanded', 'false'); }); if (willOpen) { item.classList.add('open'); button.setAttribute('aria-expanded', 'true'); } }));
document.querySelectorAll('.heart-button').forEach((button) => button.addEventListener('click', () => { const active = button.classList.toggle('active'); button.textContent = active ? '♥' : '♡'; button.setAttribute('aria-label', active ? 'Remover profissional dos salvos' : 'Salvar profissional'); }));
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
document.querySelector('#search-form')?.addEventListener('submit', () => { sessionStorage.setItem('amparo-search', JSON.stringify({ location: document.querySelector('#location').value, mode: document.querySelector('#mode').value })); });
window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', () => { document.documentElement.style.scrollBehavior = 'auto'; });
document.querySelectorAll('[data-open-services]').forEach((button) => button.addEventListener('click', () => { const chooser = document.querySelector('#escolher-servico'); chooser.hidden = false; chooser.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
