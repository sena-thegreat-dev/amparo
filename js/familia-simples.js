const screens = document.querySelectorAll('#family-simple [data-screen]');
const familyData = (() => { try { return JSON.parse(sessionStorage.getItem('amparo-family-demo') || '{}'); } catch { return {}; } })();
const filter = document.querySelector('#simple-filter');
const requestForm = document.querySelector('#simple-request');
const review = document.querySelector('#simple-review');
let draft = null;
let selectedProfessional = null;
const validScreens = [...screens].map(screen => screen.dataset.screen);

function showScreen(name, updateHash = true) {
    if (!validScreens.includes(name)) name = 'overview';
    screens.forEach(screen => { screen.hidden = screen.dataset.screen !== name; });
    if (updateHash) history.replaceState(null, '', `#${name}`);
    if (name === 'requests') renderRequests();
    document.querySelector('#simple-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderRequests() {
    const container = document.querySelector('#simple-requests');
    container.replaceChildren();
    const item = (() => { try { return JSON.parse(sessionStorage.getItem('amparo-demo-request') || 'null'); } catch { return null; } })();
    const heading = document.createElement('h2');
    heading.textContent = item ? `${item.professional || 'Profissional'} · ${item.service}` : 'Você ainda não tem pedidos';
    const description = document.createElement('p');
    description.textContent = item ? 'Pedido preparado nesta sessão.' : 'Quando você preparar um pedido, ele aparecerá aqui.';
    container.append(heading, description);
}
if (familyData.name) document.querySelector('#family-welcome').textContent = `Olá, ${familyData.name}! Como podemos ajudar?`;
if (familyData.careFor === 'other' && familyData.recipient) document.querySelector('#family-intro').textContent = `Encontre apoio para ${familyData.recipient}.`;
if (familyData.service) filter.elements.service.value = familyData.service;
if (familyData.location) filter.elements.location.value = familyData.location;
function renderSearch() {
    const locationValue = filter.elements.location.value.trim();
    const container = document.querySelector('#simple-results');
    const matches = AmparoProfessionals.search(filter.elements.service.value, locationValue);
    container.replaceChildren();
    const summary = document.createElement('p');
    summary.textContent = !locationValue ? 'Informe a cidade para encontrar profissionais.' : matches.length ? `${matches.length} ${matches.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'} para esta cidade e serviço.` : 'Nenhum profissional encontrado para esta cidade e serviço. Confira a cidade ou tente outro serviço.';
    container.append(summary);
    matches.forEach(person => {
        const card = document.createElement('article');
        card.className = 'simple-card simple-person';
        const info = document.createElement('div');
        const name = document.createElement('h2'); name.textContent = person.name;
        const location = document.createElement('p'); location.textContent = `${person.city} · ${person.state}`;
        const services = document.createElement('p'); services.textContent = person.services.join(' · ');
        info.append(name, location, services);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'simple-primary'; button.textContent = 'Conhecer profissional';
        button.addEventListener('click', () => {
            selectedProfessional = person;
            document.querySelector('#simple-profile-name').textContent = person.name;
            document.querySelector('#simple-profile-location').textContent = `${person.city} · ${person.state}`;
            document.querySelector('#simple-profile-services').textContent = `Serviços: ${person.services.join(', ')}.`;
            showScreen('profile');
        });
        card.append(info, button);
        container.append(card);
    });
}
document.querySelectorAll('#family-simple [data-open]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.open)));
filter.elements.service.addEventListener('change', () => { selectedProfessional = null; renderSearch(); });
filter.elements.location.addEventListener('input', () => { selectedProfessional = null; document.querySelector('#simple-results').textContent = 'Atualize a busca para ver profissionais nesta região.'; });
filter.elements.location.addEventListener('change', () => { selectedProfessional = null; renderSearch(); });
filter.addEventListener('submit', event => {
    event.preventDefault();
    const locationValue = filter.elements.location.value.trim();
    if (locationValue) document.querySelector('#simple-map').src = `https://www.google.com/maps?q=${encodeURIComponent(locationValue)}&output=embed`;
    renderSearch();
});
requestForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!requestForm.reportValidity()) return;
    if (!selectedProfessional) { showScreen('search'); return; }
    draft = { professional: selectedProfessional.name, service: filter.elements.service.value, date: requestForm.elements.date.value, time: requestForm.elements.time.value, address: requestForm.elements.address.value, notes: requestForm.elements.notes.value };
    review.replaceChildren();
    [['Profissional', draft.professional], ['Serviço', draft.service], ['Data', draft.date.split('-').reverse().join('/')], ['Horário', draft.time], ['Endereço', draft.address], ...(draft.notes ? [['Observações', draft.notes]] : [])].forEach(([label, value]) => {
        const line = document.createElement('p');
        const title = document.createElement('strong');
        title.textContent = `${label}: `;
        line.append(title, document.createTextNode(value));
        review.append(line);
    });
    showScreen('review');
});
document.querySelector('#simulate-request').addEventListener('click', () => {
    if (!draft) { showScreen('request'); return; }
    sessionStorage.setItem('amparo-demo-request', JSON.stringify({ professional: draft.professional, service: draft.service }));
    showScreen('sent');
});
window.addEventListener('hashchange', () => showScreen(location.hash.slice(1), false));
renderSearch();
showScreen(location.hash.slice(1), false);
