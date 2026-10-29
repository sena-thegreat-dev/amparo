# Amparo

Protótipo estático responsivo da plataforma Amparo, organizado em quatro experiências:

- `index.html`: landing pública;
- `pages/familia.html`: jornada da família;
- `pages/cuidador.html`: área do profissional;
- `pages/intranet.html`: operação administrativa.

## Convenções atuais

- `style/core.css` contém os comportamentos visuais e de acessibilidade comuns;
- cada área possui CSS e JavaScript próprios, evitando acoplamento entre as telas; `acesso.css` é compartilhado entre login e cadastros, e `cadastro-familia.js` cuida das escolhas do cadastro da família;
- a nova jornada usa `familia-simples.css` e `familia-simples.js`; o HTML e os arquivos da área anterior foram preservados para referência, mas não são executados na nova jornada;
- telas internas aceitam hashes para abrir um estado específico, por exemplo `pages/familia.html#search`, `pages/cuidador.html#agenda` e `pages/intranet.html#admin-docs`;
- os dados e as ações são demonstrativos: nenhum pagamento, alteração cadastral ou decisão administrativa é persistida.

## Fluxo demonstrativo de cuidado

Na página inicial, escolha “Encontrar cuidador” e um serviço. No cadastro, selecione se o cuidado é para você ou outra pessoa. A área da família permite consultar um perfil fictício e simular um pedido. O nome, a região e a escolha ficam em `sessionStorage` apenas durante a sessão da aba; a simulação de pedido guarda apenas o serviço. Não há criação de conta, autenticação real, envio a profissionais ou pagamento. Não insira dados sensíveis no protótipo. O mapa depende de conexão com o Google Maps.

A busca usa os exemplos locais de `js/profissionais-demo.js`, filtrados por serviço e município (São Paulo e Guarulhos). Não usa distância, bairro, agenda real, cadastros reais nem verificação de habilitações. Resultados e perfis são fictícios e não devem ser usados para contratações reais. A busca real deverá consultar profissionais e escopos de atendimento no backend.

As sugestões de endereço e a geocodificação reversa usam Geoapify. Crie uma chave de navegador em https://myprojects.geoapify.com/ e configure `window.AMPARO_GEOAPIFY_KEY` no arquivo local `js/config-endereco.js` (ignorado pelo Git). Em uma nova cópia, crie esse arquivo com `window.AMPARO_GEOAPIFY_KEY = 'SUA_CHAVE';`. A chave de navegador é visível no cliente: restrinja-a aos domínios autorizados no painel do provedor e nunca use uma chave secreta. Sem chave, o endereço pode ser digitado manualmente. Sugestões são solicitadas após três caracteres e 600 ms sem digitação. A geolocalização exige permissão e contexto seguro, como localhost ou HTTPS. Monitore a cota e mantenha as atribuições do provedor e do OpenStreetMap.

## Evolução para MVC

O plano de rotas, controllers, parciais, entidades e cuidados de segurança está em [docs/mvc-migration.md](docs/mvc-migration.md).
