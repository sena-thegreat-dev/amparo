// Dados fictícios locais; não representam profissionais reais nem validação de habilitação.
(function (root) {
    const professionals = [
        { id: 'beto', name: 'Beto', city: 'São Paulo', state: 'SP', services: ['Banho e higiene', 'Acompanhamento', 'Cuidados do dia a dia'] },
        { id: 'claudia', name: 'Cláudia', city: 'São Paulo', state: 'SP', services: ['Troca de curativos', 'Acompanhamento'] },
        { id: 'gabriel', name: 'Gabriel', city: 'Guarulhos', state: 'SP', services: ['Banho e higiene', 'Cuidados do dia a dia'] }
    ];
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    function search(service, location) {
        const text = normalize(location);
        if (!text) return [];
        const parts = text.split(',').map(part => part.trim()).filter(Boolean);
        if (parts[parts.length - 1] === 'brasil' || parts[parts.length - 1] === 'brazil') parts.pop();
        if (parts.length >= 2 && parts[parts.length - 1] === 'sp') parts.pop();
        else if (parts[parts.length - 1] === 'sao paulo' && (parts.length >= 3 || (parts.length === 2 && parts[0] === 'guarulhos'))) parts.pop();
        return professionals.filter(person => person.services.includes(service) && parts.some(part => part === normalize(person.city) || part === `${normalize(person.city)}/sp`));
    }
    const api = { professionals, search };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.AmparoProfessionals = api;
})(typeof window !== 'undefined' ? window : globalThis);
