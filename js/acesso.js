const access = document.querySelector('[data-access-form]'),
    buttons = document.querySelectorAll('[data-role]'),
    role = document.querySelector('#role'),
    label = document.querySelector('#credential-label'),
    credential = document.querySelector('#credential');

function setRole(value) {
    role.value = value;
    buttons.forEach(b => b.classList.toggle('active', b.dataset.role === value));
    const labels = { family: 'CPF', caregiver: 'COREN', admin: 'Login administrativo' };
    const placeholders = { family: '000.000.000-00', caregiver: 'COREN-SP 123456', admin: 'admin' };
    label.textContent = labels[value];
    credential.placeholder = placeholders[value];
    credential.inputMode = value === 'family' ? 'numeric' : 'text';
}
buttons.forEach(b => b.addEventListener('click', () => setRole(b.dataset.role)));
setRole(role?.value || 'family');
access?.addEventListener('submit', e => {
    e.preventDefault();
    if (!access.reportValidity()) return;
    const data = new FormData(access),
        kind = data.get('role'),
        id = String(data.get('credential')).toLowerCase(),
        password = String(data.get('password')),
        error = document.querySelector('#access-error');

    let page = kind === 'caregiver' ? 'cuidador.html' : 'familia.html'; if (kind === 'admin') { if (id !== 'admin' || password !== 'admin') { error.textContent = 'Para a demonstração administrativa, use login e senha admin.'; return } page = 'intranet.html' } sessionStorage.setItem('amparo-session', JSON.stringify({ role: kind })); location.href = page
}); document.querySelector('[data-registration-form]')?.addEventListener('submit', e => { e.preventDefault(); if (e.currentTarget.reportValidity()) location.href = 'login.html?cadastro=ok' });
