# Amparo

Protótipo estático responsivo da plataforma Amparo, organizado em quatro experiências:

- `index.html`: landing pública;
- `pages/familia.html`: jornada da família;
- `pages/cuidador.html`: área do profissional;
- `pages/intranet.html`: operação administrativa.

## Convenções atuais

- `style/core.css` contém os comportamentos visuais e de acessibilidade comuns;
- cada tela possui CSS e JavaScript próprios, evitando acoplamento entre as áreas;
- telas internas aceitam hashes para abrir um estado específico, por exemplo `pages/familia.html#finance`, `pages/cuidador.html#agenda` e `pages/intranet.html#admin-docs`;
- os dados e as ações são demonstrativos: nenhum pagamento, alteração cadastral ou decisão administrativa é persistida.

## Evolução para MVC

O plano de rotas, controllers, parciais, entidades e cuidados de segurança está em [docs/mvc-migration.md](docs/mvc-migration.md).
