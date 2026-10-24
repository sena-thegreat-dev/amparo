# Preparação para MVC

## Estado atual

O projeto permanece estático e demonstrativo: cada área de produto está em uma página HTML e seus estados internos são alternados no JavaScript. Os dados são deliberadamente fictícios e as ações não fazem chamadas externas.

As telas já carregam uma base visual compartilhada (`style/core.css`) e usam identificadores estáveis de página e painel. Isso permite substituir dados estáticos por dados do servidor sem alterar a estrutura visual.

## Rotas sugeridas

| Área atual | Controller sugerido | Rotas iniciais |
| --- | --- | --- |
| Landing | `LandingController` | `GET /` |
| Família | `FamilyDashboardController` | `GET /familia`, `GET /familia/cuidadores`, `GET /familia/contratacoes`, `GET /familia/financeiro` |
| Cuidador | `CaregiverDashboardController` | `GET /cuidador`, `GET /cuidador/oportunidades`, `GET /cuidador/agenda`, `GET /cuidador/repasses` |
| Administração | `AdminDashboardController` | `GET /administracao`, `GET /administracao/usuarios`, `GET /administracao/documentos`, `GET /administracao/conciliacao`, `GET /administracao/ocorrencias`, `GET /administracao/auditoria` |

## Views e componentes

Ao adotar MVC, extraia as partes repetidas para layouts/parciais antes de migrar os conteúdos:

- `layouts/public`, `layouts/family`, `layouts/caregiver` e `layouts/admin`;
- parciais de cabeçalho, menu lateral, toast, cartão, tabela e bloco informativo;
- cada seção hoje renderizada por JavaScript passa a ser uma view ou partial retornada pelo controller;
- mantenha `style/core.css` como base comum e os CSS de área como folhas específicas.

## Entidades e serviços

Comece por `User`, `Profile`, `CareRecipient`, `CaregiverProfile`, `Availability`, `ServiceRequest`, `Service`, `PaymentAuthorization`, `Payout`, `DocumentVerification`, `Occurrence` e `AuditEvent`.

Isolar a regra de negócio em serviços evita que controllers carreguem lógica de aceite, pré-autorização, repasse, verificação documental e auditoria. Ações administrativas devem sempre criar um `AuditEvent` com autor, entidade, estado anterior, estado posterior, motivo e data.

## Segurança a preservar

- Autorização por papel no servidor para família, cuidador e administração.
- Dados pessoais e anexos sempre mascarados fora do contexto autorizado.
- Pagamento, cancelamento, aprovação documental, alterações bancárias e decisões de ocorrência exigem validação no servidor e confirmação explícita.
- Auditoria é append-only: correções criam um novo evento, nunca sobrescrevem registros anteriores.
