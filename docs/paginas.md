# Documentação das Páginas — Inês Assessoria em Negócios

Clone estático completo em **HTML, CSS e JavaScript puro**, preservando integralmente a estrutura visual e todas as 15 páginas do site original (`inesassessoria.com.br`).

---

## 1. Mapa Completo das 15 Páginas

| # | Página | URL Original | Arquivo Local | Formulário / Observação |
|---|--------|--------------|---------------|-------------------------|
| 1 | **Home (Página Inicial)** | `/` | [index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/index.html) | Formulário de solicitação de proposta (`#cta`) |
| 2 | **Sobre Nós** | `/empresa/` | [empresa/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/empresa/index.html) | Página institucional da empresa |
| 3 | **Contatos** | `/contatos/` | [contatos/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/contatos/index.html) | Formulário de contato (Nome, E-mail, Telefone, Mensagem) |
| 4 | **Nossos Serviços** | `/nossos-servicos/` | [nossos-servicos/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/nossos-servicos/index.html) | Grade com todos os serviços |
| 5 | **Depoimentos** | `/depoimentos/` | [depoimentos/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/depoimentos/index.html) | Inclui modal de envio de depoimento (popup `13415`) |
| 6 | **Políticas de Privacidade** | `/politicas-de-privacidade/` | [politicas-de-privacidade/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/politicas-de-privacidade/index.html) | Texto legal / LGPD |
| 7 | **InstaBios (Links Rápidos)** | `/instabios/` | [instabios/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/instabios/index.html) | Recriada funcionalmente no estilo Linktree com logo, WhatsApp, telefone e links para todos os serviços |
| 8 | **Empréstimo Consignado** | `/servicos/consignado-privado/` | [servicos/consignado-privado/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/consignado-privado/index.html) | Página de serviço + mapa |
| 9 | **Refinanciamento de Imóvel** | `/servicos/consignado-publico/` | [servicos/consignado-publico/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/consignado-publico/index.html) | Página de serviço + mapa |
| 10 | **Consórcio Contemplado e a Contemplar** | `/servicos/consorcio-contemplado-e-a-contemplar/` | [servicos/consorcio-contemplado-e-a-contemplar/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/consorcio-contemplado-e-a-contemplar/index.html) | Página de serviço + mapa |
| 11 | **Financiamento Imobiliário** | `/servicos/financiamento-imobiliario/` | [servicos/financiamento-imobiliario/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/financiamento-imobiliario/index.html) | Página de serviço + mapa |
| 12 | **Adiantamento de FGTS** | `/servicos/emprestimo-pessoal/` | [servicos/emprestimo-pessoal/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/emprestimo-pessoal/index.html) | Página de serviço + mapa |
| 13 | **Limite do Cartão em Dinheiro** | `/servicos/transforme-o-limite-do-seu-cartao-em-dinheiro/` | [servicos/transforme-o-limite-do-seu-cartao-em-dinheiro/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/transforme-o-limite-do-seu-cartao-em-dinheiro/index.html) | Página de serviço + mapa |
| 14 | **Correspondente Bancário BDMG** | `/servicos/correspondente-bancario-bdmg/` | [servicos/correspondente-bancario-bdmg/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/correspondente-bancario-bdmg/index.html) | Página de serviço + mapa |
| 15 | **Simule seu Empréstimo** | `/servicos/simule-seu-emprestimo-em-poucos-passos/` | [servicos/simule-seu-emprestimo-em-poucos-passos/index.html](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/servicos/simule-seu-emprestimo-em-poucos-passos/index.html) | Página de serviço + mapa |

---

## 2. Estrutura de Arquivos Compartilhados

* `assets/vendor/` — CSS, fontes, ícones (FontAwesome, eicons) e imagens originais baixadas localmente.
* `assets/css/overrides.css` — Ajustes leves de exibição para popups, submenus e animações em JS puro.
* `assets/js/main.js` — Controle de popups (`11574` menu mobile, `11698` WhatsApp flutuante, `13415` depoimento, `3837` aviso), submenus, scroll suave e animações.
* `assets/js/forms.js` — Intercepta todos os formulários (`.elementor-form`) e envia os dados via `POST` para a URL do Google Apps Script configurada em `window.INES_FORMS_CONFIG.appsScriptUrl`.
* `docs/google-apps-script.gs` — Código pronto para colar no **Google Apps Script** vinculado à sua planilha do Google Sheets.

---

## 3. Como Configurar os Formulários no Google Sheets

1. Crie ou abra a planilha no **Google Sheets**.
2. Acesse **Extensões > Apps Script**.
3. Cole o conteúdo de [google-apps-script.gs](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/docs/google-apps-script.gs) e salve.
4. Clique em **Implantar > Nova implantação**:
   * **Tipo:** App da Web
   * **Executar como:** Eu
   * **Quem pode acessar:** Qualquer pessoa
5. Copie a URL do Web App gerada (`/exec`) e cole em `appsScriptUrl` no início do arquivo [forms.js](file:///z:/Fhelipe/Reposit%C3%B3rios/inesassessoria/assets/js/forms.js).

