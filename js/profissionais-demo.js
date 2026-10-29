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
        const otherStates = ['ac', 'al', 'am', 'ap', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mg', 'ms', 'mt', 'pa', 'pb', 'pe', 'pi', 'pr', 'rj', 'rn', 'ro', 'rr', 'rs', 'sc', 'se', 'to', 'acre', 'alagoas', 'amazonas', 'amapa', 'bahia', 'ceara', 'distrito federal', 'espirito santo', 'goias', 'maranhao', 'minas gerais', 'mato grosso do sul', 'mato grosso', 'para', 'paraiba', 'pernambuco', 'piaui', 'parana', 'rio de janeiro', 'rio grande do norte', 'rondonia', 'roraima', 'rio grande do sul', 'santa catarina', 'sergipe', 'tocantins'];
        if (parts.length > 1 && otherStates.includes(parts[parts.length - 1])) return [];
        if (parts.length >= 2 && parts[parts.length - 1] === 'sp') parts.pop();
        else if (parts[parts.length - 1] === 'sao paulo' && parts.length >= 3) parts.pop();
        else if (parts.length === 2 && parts[1] === 'sao paulo') {
            const neighborhoods = ['pinheiros', 'guaianases', 'vila olimpia', 'moema', 'tatuape', 'saude', 'aclimacao', 'santo amaro'];
            if (!neighborhoods.includes(parts[0]) && parts[0] !== 'sao paulo') parts.pop();
        }
        return professionals.filter(person => person.services.includes(service) && parts.some(part => part === normalize(person.city) || part === `${normalize(person.city)}/sp`));
    }
    const api = { professionals, search };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.AmparoProfessionals = api;
})(typeof window !== 'undefined' ? window : globalThis);
