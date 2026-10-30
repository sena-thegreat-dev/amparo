const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('preenche o endereço mesmo quando o botão de localização perde o foco', async () => {
    function element() {
        return { handlers: {}, children: [], value: '', textContent: '', hidden: false,
            addEventListener(name, fn) { this.handlers[name] = fn; },
            setAttribute() {}, dispatchEvent() {}, replaceChildren() { this.children = []; },
            querySelectorAll() { return []; } };
    }
    const input = element(), status = element(), results = element(), search = element(), geolocate = element();
    let success;
    const fields = { '[data-address-input]': input, '[data-address-status]': status, '[data-address-results]': results, '[data-address-search]': search, '[data-address-geolocate]': geolocate };
    const container = element();
    container.querySelector = selector => fields[selector];
    container.contains = () => false;
    const document = { querySelectorAll: () => [container], addEventListener() {} };
    const context = { document, window: { isSecureContext: true }, navigator: { geolocation: { getCurrentPosition(callback) { success = callback; } } }, URL, AbortController, DOMException, setTimeout, clearTimeout, Event, fetch: async () => ({ ok: true, json: async () => ({ display_name: 'São Paulo, Brasil' }) }) };
    vm.runInNewContext(fs.readFileSync('js/endereco.js', 'utf8'), context);
    geolocate.handlers.click();
    container.handlers.focusout({ relatedTarget: null });
    await success({ coords: { latitude: -23.55, longitude: -46.63 } });
    assert.equal(input.value, 'São Paulo, Brasil');
    assert.equal(geolocate.disabled, false);
});
