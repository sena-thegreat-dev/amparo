(() => {
    const endpoint = window.AMPARO_NOMINATIM_URL || 'https://nominatim.openstreetmap.org';
    const cache = new Map();
    let queue = Promise.resolve();
    let lastRequest = 0;
    function lookup(path, parameters, signal) {
        const url = new URL(path, endpoint);
        Object.entries({ ...parameters, format: 'jsonv2', 'accept-language': 'pt-BR' }).forEach(([name, value]) => url.searchParams.set(name, value));
        const cacheKey = url.toString();
        if (cache.has(cacheKey)) return Promise.resolve(cache.get(cacheKey));
        const request = queue.catch(() => {}).then(async () => {
            const wait = Math.max(0, 1100 - (Date.now() - lastRequest));
            if (wait) await new Promise(resolve => setTimeout(resolve, wait));
            if (signal?.aborted) throw new DOMException('Consulta cancelada', 'AbortError');
            lastRequest = Date.now();
            const response = await fetch(url, { signal });
            if (!response.ok) throw new Error('Serviço indisponível');
            const data = await response.json();
            cache.set(cacheKey, data);
            return data;
        });
        queue = request;
        return request;
    }
    document.querySelectorAll('[data-address]').forEach(container => {
        const input = container.querySelector('[data-address-input]');
        const status = container.querySelector('[data-address-status]');
        const results = container.querySelector('[data-address-results]');
        const search = container.querySelector('[data-address-search]');
        const geolocate = container.querySelector('[data-address-geolocate]');
        let controller, version = 0;
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-haspopup', 'true');
        function closeResults() {
            results.hidden = true;
            input.setAttribute('aria-expanded', 'false');
        }
        function clearPending() { if (controller) controller.abort(); version++; }
        function choose(name) {
            clearPending();
            input.value = name;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            results.replaceChildren();
            closeResults();
            status.textContent = 'Endereço selecionado. Confira se está correto.';
        }
        async function suggest() {
            clearPending();
            const query = input.value.trim();
            results.replaceChildren();
            closeResults();
            if (query.length < 3) { status.textContent = 'Digite pelo menos três letras.'; return; }
            const current = version;
            controller = new AbortController();
            status.textContent = 'Buscando endereços…';
            try {
                const matches = await lookup('/search', { q: query, countrycodes: 'br', limit: '5' }, controller.signal);
                if (current !== version) return;
                status.textContent = matches.length ? 'Escolha um endereço:' : 'Nenhum endereço encontrado. Tente incluir a cidade.';
                matches.forEach(match => {
                    if (!match.display_name) return;
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.textContent = match.display_name;
                    button.addEventListener('click', () => choose(match.display_name));
                    results.append(button);
                });
                if (results.children.length) {
                    results.hidden = false;
                    input.setAttribute('aria-expanded', 'true');
                }
            } catch (error) { if (error.name !== 'AbortError' && current === version) status.textContent = 'Não foi possível buscar o endereço. Você pode digitá-lo manualmente.'; }
        }
        input.addEventListener('input', () => {
            clearPending();
            results.replaceChildren();
            closeResults();
            status.textContent = '';
        });
        search.addEventListener('click', suggest);
        container.addEventListener('keydown', event => {
            const options = [...results.querySelectorAll('button')];
            if (event.key === 'Escape' && !results.hidden) {
                clearPending();
                closeResults();
                input.focus();
                event.preventDefault();
            } else if (event.key === 'ArrowDown' && !results.hidden && options.length) {
                const index = options.indexOf(document.activeElement);
                options[Math.min(index + 1, options.length - 1)].focus();
                event.preventDefault();
            } else if (event.key === 'ArrowUp' && !results.hidden && options.length) {
                const index = options.indexOf(document.activeElement);
                (index <= 0 ? input : options[index - 1]).focus();
                event.preventDefault();
            }
        });
        document.addEventListener('pointerdown', event => {
            if (!container.contains(event.target)) { clearPending(); closeResults(); }
        });
        container.addEventListener('focusout', event => {
            if (!container.contains(event.relatedTarget)) closeResults();
        });
        geolocate.addEventListener('click', () => {
            clearPending();
            results.replaceChildren();
            closeResults();
            if (!window.isSecureContext) { status.textContent = 'Para usar sua localização, acesse o site por localhost ou HTTPS.'; return; }
            if (!navigator.geolocation) { status.textContent = 'Localização indisponível. Digite o endereço manualmente.'; return; }
            geolocate.disabled = true;
            status.textContent = 'Buscando sua localização…';
            const current = version;
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                if (current !== version) { geolocate.disabled = false; return; }
                try {
                    const timeout = new AbortController();
                    const timer = setTimeout(() => timeout.abort(), 12000);
                    let match;
                    try {
                        match = await lookup('/reverse', { lat: coords.latitude.toFixed(5), lon: coords.longitude.toFixed(5) }, timeout.signal);
                    } finally {
                        clearTimeout(timer);
                    }
                    if (current !== version) return;
                    if (!match.display_name) throw new Error('Endereço não encontrado');
                    choose(match.display_name);
                } catch { if (current === version) status.textContent = 'Não foi possível identificar o endereço. Digite-o manualmente.'; }
                finally { geolocate.disabled = false; }
            }, (error) => { if (current === version) status.textContent = error.code === 1 ? 'Permita o acesso à localização no navegador ou informe o endereço manualmente.' : 'Não foi possível obter sua localização. Tente novamente ou digite o endereço.'; geolocate.disabled = false; }, { enableHighAccuracy: false, timeout: 15000 });
        });
    });
})();
