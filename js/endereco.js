(() => {
    const key = window.AMPARO_GEOAPIFY_KEY || 'bbc9d4cc265b49a8a549f338a05670db';
    async function lookup(path, parameters, signal) {
        const url = new URL(`https://api.geoapify.com/v1/geocode/${path}`);
        Object.entries({ ...parameters, format: 'json', lang: 'pt', apiKey: key }).forEach(([name, value]) => url.searchParams.set(name, value));
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Serviço indisponível');
        return (await response.json()).results || [];
    }
    document.querySelectorAll('[data-address]').forEach(container => {
        const input = container.querySelector('[data-address-input]');
        const status = container.querySelector('[data-address-status]');
        const results = container.querySelector('[data-address-results]');
        const search = container.querySelector('[data-address-search]');
        const geolocate = container.querySelector('[data-address-geolocate]');
        let timer, controller, version = 0;
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-haspopup', 'true');
        function closeResults() {
            results.hidden = true;
            input.setAttribute('aria-expanded', 'false');
        }
        function clearPending() { clearTimeout(timer); if (controller) controller.abort(); version++; }
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
            if (!key) { status.textContent = 'Sugestões indisponíveis. Você pode digitar o endereço completo.'; return; }
            const current = version;
            controller = new AbortController();
            status.textContent = 'Buscando endereços…';
            try {
                const matches = await lookup('autocomplete', { text: query, filter: 'countrycode:br', limit: '5' }, controller.signal);
                if (current !== version) return;
                status.textContent = matches.length ? 'Escolha um endereço:' : 'Nenhum endereço encontrado. Tente incluir a cidade.';
                matches.forEach(match => {
                    if (!match.formatted) return;
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.textContent = match.formatted;
                    button.addEventListener('click', () => choose(match.formatted));
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
            if (input.value.trim().length >= 3) timer = setTimeout(suggest, 600);
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
            if (!container.contains(event.relatedTarget)) { clearPending(); closeResults(); }
        });
        geolocate.addEventListener('click', () => {
            clearPending();
            results.replaceChildren();
            closeResults();
            if (!key) { status.textContent = 'Localização por endereço indisponível. Digite o endereço manualmente.'; return; }
            if (!navigator.geolocation) { status.textContent = 'Localização indisponível. Digite o endereço manualmente.'; return; }
            geolocate.disabled = true;
            status.textContent = 'Buscando sua localização…';
            const current = version;
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                if (current !== version) { geolocate.disabled = false; return; }
                try {
                    const matches = await lookup('reverse', { lat: coords.latitude.toFixed(5), lon: coords.longitude.toFixed(5) });
                    if (current !== version) return;
                    if (!matches[0]?.formatted) throw new Error('Endereço não encontrado');
                    choose(matches[0].formatted);
                } catch { if (current === version) status.textContent = 'Não foi possível identificar o endereço. Digite-o manualmente.'; }
                finally { geolocate.disabled = false; }
            }, () => { if (current === version) status.textContent = 'Não foi possível acessar sua localização. Digite o endereço manualmente.'; geolocate.disabled = false; }, { enableHighAccuracy: false, timeout: 10000 });
        });
    });
})();
