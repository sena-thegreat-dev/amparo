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

Na página inicial, escolha “Encontrar cuidador” e um serviço. No cadastro, selecione se o cuidado é para você ou outra pessoa. A área da família permite consultar um perfil fictício e simular um pedido. O nome, a região e a escolha ficam em `sessionStorage` apenas durante a sessão da aba; a simulação de pedido guarda o nome do profissional e o serviço. Não há criação de conta, autenticação real, envio a profissionais ou pagamento. Não insira dados sensíveis no protótipo. O mapa depende de conexão com o Google Maps.

A busca usa os exemplos locais de `js/profissionais-demo.js`, filtrados por serviço e município (São Paulo e Guarulhos). Não usa distância, bairro, agenda real, cadastros reais nem verificação de habilitações. Resultados e perfis são fictícios e não devem ser usados para contratações reais. A busca real deverá consultar profissionais e escopos de atendimento no backend.

A consulta de endereço usa Nominatim/OpenStreetMap após o clique em “Buscar endereço”, e a opção de localização usa geocodificação reversa mediante permissão. O serviço público não permite autocomplete e limita o uso a uma requisição por segundo para toda a aplicação, além de exigir identificação e atribuição: https://operations.osmfoundation.org/policies/nominatim/. O controle de intervalo e o cache locais funcionam apenas na aba e não garantem o limite entre usuários. Para publicar ou escalar, use um serviço configurável adequado, com controle global e cache no servidor. A geolocalização exige localhost ou HTTPS; o endereço retornado é aproximado e deve ser conferido.

## Executar e testar localmente

Para o protótipo estático, execute `php -S localhost:8000` na raiz do projeto e abra `http://localhost:8000/`. Outra alternativa é usar um servidor estático local; localização do navegador exige `localhost` ou HTTPS. Os testes da busca são executados com `node --test tests/profissionais-demo.test.cjs`.

O diretório `backend/` contém a aplicação Laravel com cadastro e login reais, separados das páginas HTML estáticas. Use PHP 8.3+, Composer e Node.js. Em uma instalação nova, execute `composer install`, copie `.env.example` para `.env` somente se o arquivo ainda não existir, configure o banco escolhido e execute `php artisan key:generate` somente ao criar a instalação. Antes de executar `php artisan migrate` ou `php artisan db:seed`, confirme que o banco configurado é uma base local de desenvolvimento; não use esses comandos em uma base existente sem revisão. As contas de demonstração são criadas apenas nos ambientes local e testing. Depois execute `npm ci`, `npm run build` e `php artisan serve`. No servidor Laravel, acesse `/cadastro/familia`, `/cadastro/cuidador` ou `/acesso`; os arquivos estáticos abertos diretamente continuam demonstrativos. Os testes usam SQLite em memória e podem ser executados com `php artisan test`.

O cadastro Laravel valida o CPF, armazena-o criptografado e usa um índice HMAC para localizar duplicidades e autenticar. O telefone também é criptografado; senhas usam o hash do Laravel. A `APP_KEY` precisa ser mantida em segredo e preservada com backup seguro: alterá-la sem um plano de migração impede a leitura dos dados criptografados e a busca dos CPFs existentes. Perfis profissionais começam com documentação pendente; envio e verificação de documentos ainda não foram implementados. As telas internas do Laravel continuam com conteúdo fictício e exibem essa condição. Não foram implementados recuperação de senha, confirmação de e-mail ou criação pública de administradores.

## Limitações para lançamento

O site estático contém login e cadastros demonstrativos, não valida credenciais no servidor e não protege páginas internas por papel. Não publique essa versão como sistema operacional. O backend possui cadastro, login e rotas de leitura com checagem de papel, mas os serviços e políticas de propriedade ainda não implementam as operações de negócio. Pagamentos, repasses, notificações, chat, verificações, persistência dos pedidos e emissão real de certificados não estão implementados. A auditoria possui proteção no modelo, mas não garante imutabilidade no banco. Antes de qualquer lançamento são necessários controles de acesso por recurso, proteção de dados, recuperação de acesso, fluxos de contratação e testes de segurança e integração. Há ainda divergências entre as telas estáticas e as views do Laravel.

## Evolução para MVC

O plano de rotas, controllers, parciais, entidades e cuidados de segurança está em [docs/mvc-migration.md](docs/mvc-migration.md).
