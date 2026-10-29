const { test } = require('node:test');
const assert = require('node:assert/strict');
const { search } = require('../js/profissionais-demo.js');

test('filtra por serviço e cidade, ignorando acentos', () => {
    assert.deepEqual(search('Troca de curativos', 'Sao Paulo, SP').map(person => person.id), ['claudia']);
    assert.deepEqual(search('Banho e higiene', 'Guarulhos, São Paulo, Brasil').map(person => person.id), ['gabriel']);
    assert.deepEqual(search('Banho e higiene', 'Pinheiros, São Paulo').map(person => person.id), ['beto']);
});

test('não sugere profissionais para serviço, local ou estado incompatíveis', () => {
    assert.equal(search('Troca de curativos', 'Guarulhos, SP').length, 0);
    assert.equal(search('Banho e higiene', '').length, 0);
    assert.equal(search('Banho e higiene', 'São Paulo, Rio de Janeiro, Brasil').length, 0);
    assert.equal(search('Banho e higiene', 'São Paulo, RJ').length, 0);
    assert.equal(search('Banho e higiene', 'Campinas, São Paulo, Brasil').length, 0);
    assert.equal(search('Banho e higiene', 'São Paulo, Goiás, Brasil').length, 0);
});
