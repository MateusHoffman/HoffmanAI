# MATEUS HOFFMAN

**Engenheiro de Software Full Stack Sênior | Arquitetura de Software, Cloud & Inteligência Artificial**

Campinas, SP - Brasil | +55 (19) 97120-0192 | mateushoffmandev@gmail.com

[LinkedIn](https://www.linkedin.com/in/mateushoffman/) | [GitHub](https://github.com/MateusHoffman)

---

## 📌 RESUMO EXECUTIVO

Engenheiro de Software Full Stack Sênior com 5 anos de experiência no desenvolvimento, sustentação e escala de ecossistemas digitais de alta complexidade. Especializado na stack **TypeScript (React.js, React Native/Expo, Node.js/Fastify)**, com experiência também em **Java (Spring Boot)** e **Python (FastAPI / LangGraph)** para APIs de borda e agentes de IA. Atua em arquiteturas em nuvem **AWS (Lambda, SNS, SQS, S3, EventBridge, CloudWatch)** e em produtos com **chatbots, streaming SSE, observabilidade OpenTelemetry (Grafana / Tempo / Loki / Prometheus)** e provedores de LLM (**NVIDIA NIM**, Google Gemini). Possui histórico comprovado em liderança técnica de agentes de IA (RAG + function calling), produtos financeiros (Fintech / Banking as a Service), automação fiscal e modernização de sistemas legados (MongoDB → PostgreSQL).

---

## 💻 COMPETÊNCIAS TÉCNICAS ESPECIALIZADAS

### 1. Desenvolvimento Frontend (Web & Mobile)
* **Linguagens e Elevação de Tipagem:** TypeScript (superset de tipagem estática), JavaScript ES6+ (ECMAScript moderno).
* **Interfaces Web & Bibliotecas:** React.js (biblioteca reativa de UI), Vite (bundler de alta performance), React Router, TanStack Router/Query (roteamento e data-fetching), Redux Toolkit / Zustand (estado global), react-markdown (renderização de respostas de chat).
* **Aplicações Mobile:** React Native (framework multiplataforma nativo), Expo (EAS Build/Updates), React Navigation, Kubb (codegen de clients a partir de OpenAPI).
* **Estilização & Componentização:** Tailwind CSS (utility-first CSS), Radix UI, Lucide Icons, React Hook Form + Zod (formulários tipados e validados).
* **UX de Chat & Documentos:** streaming SSE no browser, sessão/histórico em localStorage, exportação de currículo em PDF (pdfmake).

### 2. Engenharia Backend & Arquitetura de Software
* **Runtimes & Frameworks:** Node.js, Fastify (APIs de baixa latência com tipagem via Zod), Express.js (sistemas legados), Serverless Framework (AWS Lambda), **Java 25 + Spring Boot** (borda HTTP, validação, rate limit, proxy SSE), **Python 3.14 + FastAPI** (serviços de agente).
* **Padrões de Comunicação:** RESTful APIs, **Server-Sent Events (SSE)** para chat em streaming, WebSockets (chat em tempo real), Webhooks autenticados, mensageria SNS/SQS com DLQ.
* **Garantia de Qualidade & Contratos:** Jest / Vitest (cobertura 100% em serviços críticos), Zod (validação runtime), TypeSpec/OpenAPI, Biome/ESLint, Husky (hooks de pre-commit/pre-push).
* **Modelagem de Dados & ORMs:** PostgreSQL (+ JDBC / Prisma ORM), MongoDB + Mongoose, Redis (cache, debounce e pub/sub), DynamoDB (auditoria de envios), pgvector (busca vetorial).

### 3. Engenharia de Inteligência Artificial & Agentes
* **Modelos & Arquitetura:** RAG (Retrieval-Augmented Generation) com embeddings e busca semântica, Function Calling / tool use, veto de temas críticos em código, ACL por agente, grafo conversacional **LangGraph** (nós generate → guard), prompt engineering com currículo como knowledge base.
* **Provedores & Orquestração:** **NVIDIA NIM** (API OpenAI-compatible, ex.: `deepseek-ai/deepseek-v4.1-flash`), Google Gemini (LLM e embeddings), n8n (automações de follow-up e webhooks), Digisac (canal WhatsApp).
* **Chatbots & Guardrails:** chatbot público com streaming, rate limit alinhado ao provedor, sanitização de respostas, bloqueio de vazamento de secrets e rejeição de saídas degeneradas.
* **Visão Computacional na Edge:** Edge AI (processamento de algoritmos de aprendizado de máquina diretamente no dispositivo cliente).

### 4. Nuvem, DevOps, Segurança & Observabilidade
* **Serviços de Nuvem (AWS):** Lambda, S3, SQS, SNS, EventBridge Scheduler, CloudWatch (crons), SSM (secrets e orquestração EC2), CodeBuild/ECR.
* **Comunicação & Pagamentos:** SendGrid (e-mail transacional), Digisac (WhatsApp), Celcoin (BaaS/Pix), Asaas (Pix/cartão).
* **Segurança:** JWT + refresh cookies, bcrypt/argon2id, Helmet, rate limiting (API + UI), CORS, validação em borda, webhooks com Bearer/assinatura, IAM least-privilege em filas, hash de IP em sessões.
* **CI/CD & Observabilidade:** Bitbucket Pipelines, Docker / Docker Compose, Sentry + OpenTelemetry, stack **LGTM** (Grafana + Tempo + Loki + Prometheus) com auditoria pública por `requestId`, LogRocket, Mixpanel, OneSignal.
* **Infraestrutura Básica:** Administração de VPS Linux, Cloudflare (DNS e segurança de borda).

---

## 🏢 EXPERIÊNCIA PROFISSIONAL DETALHADA

### **SuaMEi** | *Engenheiro de Software Full Stack Sênior & Líder Técnico de IA*
**Dezembro/2024 – Setembro/2026 | Remoto**
*Plataforma que conecta empresas contratantes a prestadores MEI/ME: formalização de CNPJ, obrigações fiscais (DAS, DASN, NFS-e), contratos, pagamentos em lote, carteira digital e benefícios (telemedicina, seguro e previdência).*

#### 🤖 Especialidade 1: Engenharia de Inteligência Artificial & Conversacional
* **Liderança da plataforma de IA:** Concebeu e liderou o ecossistema de atendimento inteligente (agentes WhatsApp + base RAG + painel de curadoria + chat web), reduzindo carga do suporte e do comercial em demandas repetitivas.
* **RAG com pgvector e Gemini:** Projetou a API de conhecimento oficial (Fastify + Prisma/PostgreSQL + pgvector): ingestão Drive → chunking → embeddings em batch via Gemini → índice vetorial (ivfflat), com ACL por agente para a IA responder só a partir de conteúdo aprovado.
* **Agente SDR (vendas):** Desenvolveu o vendedor virtual no WhatsApp (Digisac + Gemini + Fastify + Redis): qualificação de leads, extração de perfil comercial (CHAMP), handoff ao time e sincronização com ClickUp; debounce Redis (5s) para unificar rajadas de mensagens e memória de conversa com TTL.
* **Agente Jota (suporte):** Implementou runtime de atendimento com function calling, tools encadeadas (consulta RAG, escalação humana, HSM) e **veto em código** de temas críticos (fiscal sensível, cancelamento, reclamação), evitando respostas arriscadas.
* **Chat em tempo real:** Entregou o canal web do Jota (WebSocket + Redis pub/sub + webhooks n8n autenticados) e painel de auditoria das conversas para revisão humana e melhoria contínua da base.
* **Automação de follow-up (n8n):** Orquestrou jornadas de onboarding/MQL (welcome + follow-ups D1–D8) integradas ao agente SDR.
* **Segurança da camada de IA:** Endureceu a RAG API com argon2id, JWT admin, API keys com comparação constant-time, Helmet e rate limits graduados (ex.: login 5/min, search 60/min).

#### 🏦 Especialidade 2: Core Banking, Carteira Digital & Pagamentos
* **Motor BaaS serverless (Celcoin):** Projetou e evoluiu o serviço bancário da plataforma (AWS Lambda + Serverless Framework + Prisma/PostgreSQL): abertura de conta, saldo/extrato, Pix (DICT, cash-in/out, QR Code, cobrança, agendamento, limites, MED/reversão), boletos e webhooks.
* **Carteira Digital no app (Expo/React Native):** Entregou a experiência mobile do associado — chaves Pix, leitura de QR via câmera, copia-e-cola, cobranças, agendamento, estorno, limites, biometria (`expo-local-authentication`) e fluxo de e-KYC (documentos + face-match).
* **DAS Inteligente:** Implementou débito automático da guia DAS a partir da conta, com filas SNS/SQS, retries via EventBridge Scheduler e notificações (e-mail/push) de agendamento e falha.
* **Pagamentos em lote a prestadores:** Desenvolveu API e front de remessas (Fastify/Prisma + React/Vite): programação de até 3 datas, regra de obrigatoriedade de NFS-e, disparo Pix Celcoin com concorrência controlada, retentativas noturnas e 2FA no painel do contratante.
* **Onboarding KYC:** Modelou status de background check/proposta Celcoin, PIN com bcrypt e sincronização de documentos para AWS S3.

#### ☁️ Especialidade 3: Backend Moderno, Serverless, Performance & Qualidade
* **Migração monolito → microsserviços:** Conduziu a substituição gradual do backend legado (Express + MongoDB/Mongoose) por serviços modernos (Fastify + Prisma/PostgreSQL), com pontes de compatibilidade (`mongoUserId`) para não interromper operação.
* **Arquitetura event-driven:** Padronizou processamento assíncrono com SNS → SQS → DLQ (Pix agendado, Smart DAS, e-mails, WhatsApp), desacoplando picos de carga e isolando falhas.
* **Performance e resiliência:** Redis para debounce/pub-sub; warmup de Lambdas; lotes em embeddings e em RPA fiscal; concorrência limitada em Pix em massa; start/stop sob demanda de EC2 dos robôs via SSM (redução de custo ocioso).
* **Automação fiscal (RPA):** Construiu/orquestrou o robô de DAS no PGMEI (Chrome headless + CDP) e o orquestrador Lambda/CloudWatch que liga máquinas, coleta guias, faz parse de PDF (código de barras), grava no S3 e atualiza a plataforma — viabilizando escala para milhares de CNPJs sem consulta manual.
* **Comunicação centralizada:** Criou microsserviços serverless de e-mail (SendGrid) e WhatsApp (Digisac) com Zod, auth Bearer, auditoria em DynamoDB e filas com DLQ; padronizou templates com React Email.
* **SuaMED (telemedicina):** Entregou backend/front do benefício de saúde (créditos de consulta, Asaas Pix/cartão, integração Doc24 para atendimento por vídeo).
* **Qualidade de engenharia:** Impôs Jest com threshold de **100%** de cobertura em serviços críticos (BaaS, payment-api, controllers da api-rest), Vitest na RAG API, validação Zod em borda, Biome/ESLint, Husky bloqueando push/commit sem testes/lint, CI Bitbucket/CodeBuild e contratos OpenAPI/TypeSpec/Kubb.
* **Observabilidade:** Instrumentou Sentry + OpenTelemetry no BaaS serverless, Sentry no app mobile, além de Mixpanel/OneSignal para produto e engajamento.

---

### **MUU Agrotech** | *Desenvolvedor Full Stack Pleno / Mobile*
**Fevereiro/2023 – Janeiro/2025 | Remoto**
*Agtech focada no rastreamento, gestão pecuária e marketplace para compra e venda de rebanhos.*

#### 📸 Especialidade 1: Visão Computacional & Biometria Animal
* **Identificação Biométrica por IA:** Integrou modelos de visão computacional na câmera do aplicativo mobile (React Native) no projeto *Muu Biometria*.
* **Reconhecimento Biométrico:** A solução analisa a estrutura morfológica do focinho bovino (impressão digital do animal) para identificação única no sistema sem a necessidade de dispositivos físicos (brincos ou chips).

#### 📴 Especialidade 2: Engenharia Mobile Offline-First
* **Sincronização Offline:** Desenvolveu o banco de dados local com Realm DB (banco NoSQL nativo para mobile), permitindo cadastros de nascimentos, vacinas e manejos em fazendas sem conexão de rede.
* **Sincronização Assíncrona:** Criou algoritmos para resolução de conflitos de dados no momento em que o dispositivo recupera a conectividade com a internet.

#### 🗺️ Especialidade 3: Logística Geográfica & E-commerce Agro
* **Roteamento Inteligente (App Muu Transporte):** Integrei APIs de geolocalização e mapas para calcular rotas otimizadas para transporte de carga viva, evitando trajetos acidentados para reduzir o estresse térmico e mecânico nos animais.
* **Marketplace & Gateways de Pagamento:** Desenvolveu a plataforma web em React.js e Node.js integrada ao Stripe (para processamento de pagamentos com cartão de crédito) e ao Mercado Pago (para liquidação instantânea via Pix).
* **Imutabilidade de Dados:** Registrou o histórico produtivo do animal em rede Blockchain, garantindo a auditabilidade e impossibilidade de alteração de dados do histórico sanitário do rebanho.

---

### **Desenvolvedor Freelance** | *Engenheiro de Software & Automações*
**Agosto/2021 – Julho/2023 | Remoto**

#### 🤖 Especialidade: Web Scraping, Extensões & E-commerce
* **Extração de Dados em Lote (Crawlers):** Construiu robôs com Node.js, Puppeteer e Python para extração de dados públicos em plataformas de e-commerce (Mercado Livre, Goofish).
* **Evasão de Bloqueios:** Aplicou proxies rotativas (múltiplos endereços de IP) e técnicas contra fingerprinting (mecanismos que identificam navegadores automatizados) para bypass de sistemas anti-bot.
* **Extensões de Navegador:** Desenvolveu extensões para Google Chrome usando a Manifest V3 API para automação de tarefas operacionais no navegador.

---

## 🎓 FORMAÇÃO ACADÊMICA & CERTIFICAÇÕES

* **Bacharelado em Engenharia de Computação**  
  * **UNIVESP** *(Universidade Virtual do Estado de São Paulo - 1ª Universidade Pública Virtual do Brasil)*  
  * *Previsão de Conclusão: Julho/2029* | **Média Geral: 8.52 / 10.0**  
  * *Disciplinas de Destaque:* Banco de Dados (Nota 10.0), Cálculo II (Nota 10.0), Física do Movimento (Nota 10.0), Algoritmos e Estrutura de Dados.

* **Formação em Desenvolvimento Web Full Stack (1.500 horas)**  
  * **Trybe** — *Janeiro/2022 – Janeiro/2023*  
  * **Especialização Prática:** Fundamentos Web (HTML/CSS/JS), Frontend (React/Redux), Backend (Node.js/SQL/NoSQL/Docker) e Ciência da Computação (Python, Estruturas de Dados e Algoritmos).

---

## 🧪 PROJETOS PESSOAIS DE IMPACTO (SIDE PROJECTS)

### 1. HoffmanAI — Chatbot público do currículo com observabilidade OSS
* **Descrição:** Case full stack em monorepo para recrutadores e tech leads: chat streaming sobre a trajetória profissional (com análise de fit de vaga), leitura/exportação do currículo e auditoria pública de requests — tudo instrumentado e auditável por `requestId`.
* **Arquitetura:** 3 serviços em Docker Compose — **web** (React + TypeScript + Vite + Tailwind), **api** (Java 25 + Spring Boot como borda pública) e **agent** (Python + FastAPI + LangGraph na rede interna); PostgreSQL para sessões/mensagens/audit; browser fala **somente** com a API.
* **Chatbot & LLM:** integração com **NVIDIA NIM** (`integrate.api.nvidia.com`, modelo `deepseek-ai/deepseek-v4.1-flash`); fluxo LangGraph **generate → guard**; currículo injetado no system prompt; streaming **SSE** ponta a ponta; rate limit (40 msg/min) alinhado ao plano gratuito do provedor, com countdown na UI.
* **Observabilidade:** OpenTelemetry (API + agent) → OTel Collector → **Tempo / Loki / Prometheus / Grafana** (Viewer anônimo); página `/observabilidade` com metadados ao vivo (latência, modelo, tokens, status) sem expor o texto do chat.
* **Frontend & produto:** UI no estilo ChatGPT (sidebar, sessão em localStorage, markdown, export PDF do currículo), CORS/proxy de desenvolvimento e UX orientada a entrevista técnica (“pergunte sobre mim e veja o código/traces”).

### 2. HairHub — Agente de IA para Agendamentos
* **Descrição:** Secretária virtual para barbearias baseada em Inteligência Artificial para atendimento automatizado.
* **Arquitetura Técnica:** Fluxos automatizados em n8n em VPS dedicada, gerenciamento de rotas via Cloudflare, RAG (Retrieval-Augmented Generation) para dúvidas do estabelecimento e integração direta com a Google Calendar API para agendamento automático na agenda dos profissionais.

### 3. Te Amo Muito — SaaS Micro-Ecommerce Transacional
* **Descrição:** Plataforma automatizada que constrói e publica landing pages customizadas para casais.
* **Arquitetura Técnica:** Desenvolvido em React.js, Node.js e Tailwind CSS. Conexão via Webhook com o Mercado Pago para identificação e liberação instantânea do site após o pagamento via Pix.

### 4. Algoritmo Fundamentalista & Scraping B3
* **Descrição:** Sistema de análise de dados do mercado de ações e opções operando na Bolsa de Valores.
* **Arquitetura Técnica:** Scripts em Python e Node.js para coleta de dados financeiros em tempo real. Algoritmo que calcula assimetria de volatilidade e sugere a melhor taxa de rentabilidade para a venda coberta do mês.

### 5. Bot de Arbitragem 24/7 (Skins de Jogos)
* **Descrição:** Script autônomo operando em nuvem para negociação e arbitragem de ativos digitais.
* **Arquitetura Técnica:** Monitoramento via WebSockets e APIs REST de marketplaces mundiais para identificar distorções de preços e executar ordens automáticas de compra e venda com lucro pré-calculado.

---

## 🌐 IDIOMAS & CONCEITOS ARQUITETURAIS

* **Português:** Idioma Nativo.
* **Inglês:** Nível avançado para leitura de documentações técnicas, escrita e comunicação em ambientes de tecnologia.
* **Conceitos de Engenharia de Software:** TDD (Test-Driven Development), SOLID (princípios de orientação a objetos e arquitetura limpa), Clean Architecture, DDD (Domain-Driven Design), Microsserviços, Arquitetura Serverless, Event-Driven Architecture, BFF/proxy SSE, monorepo poliglota (TypeScript + Java + Python), observabilidade como produto (traces/logs/métricas correlacionados).
