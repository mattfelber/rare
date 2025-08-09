# RARO - Ultra-Exclusive Brazilian Marketplace

Uma plataforma de marketplace ultra-exclusiva que incorpora o princípio da escassez, oferecendo aos visitantes brasileiros uma experiência de compra de itens raros e luxuosos de origem internacional.

**🌟 Agora disponível no GitHub Pages!**

## 🎯 Conceito

**"Raridade não é encontrada. Ela encontra você."**

RARO é um marketplace que faz os consumidores brasileiros sentirem que descobriram um mercado ultra-exclusivo, apenas para membros. Oferecemos uma seleção altamente limitada e rotativa de produtos raros, luxuosos e de origem internacional - itens que parecem "reais", inatingíveis e irresistivelmente colecionáveis.

## 🚀 Deployments

### GitHub Pages (Recomendado)
O site agora está configurado para deploy automático no GitHub Pages usando GitHub Actions.

**Como configurar:**
1. Vá para Settings > Pages no repositório GitHub
2. Selecione "GitHub Actions" como source
3. O deploy acontece automaticamente a cada push para `main`/`master`

**Build local:**
```bash
# Instale dependências
npm install

# Gere os arquivos estáticos
npm run build

# Os arquivos gerados ficam na pasta 'dist/'
```

### Vercel (Legado)
O projeto ainda funciona no Vercel usando a configuração do `api/index.js`.

```bash
# Instale dependências
npm install

# Execute localmente  
npm start
```

## ✨ Características Principais

### Design & Estética
- **Luxo Discreto**: Paleta de cores profundas (preto, dourado, esmeralda)
- **Tipografia Elegante**: Playfair Display + Inter para máxima sofisticação
- **Interface Limpa**: O produto é sempre o herói da experiência

### Psicologia da Escassez
- ⏰ **Contadores de Tempo**: Urgência visual com countdown em tempo real
- 📊 **Quantidades Limitadas**: "Apenas 3 restantes" claramente visível
- 🔔 **Notificações de Compra**: Proof social com compras recentes
- 💨 **Desaparecimento**: Produtos esgotados somem para sempre

### Controle de Acesso
- 🎫 **Códigos de Convite**: Acesso restrito por convite
- 🚫 **Limite de Compra**: Máximo 1 item por cliente por ciclo
- 👑 **Círculo Exclusivo**: Sensação de fazer parte de algo especial

### Apelo Brasileiro
- 💰 **Preços em BRL**: Valores em Real Brasileiro
- 🇧🇷 **Copy Culturalmente Relevante**: Linguagem que ressoa com brasileiros
- 🌍 **Raridade Internacional**: Produtos impossíveis de encontrar no Brasil

## 🚀 Como Executar

### GitHub Pages (Produção)
1. **Configure GitHub Pages**:
   - Vá para Settings > Pages no seu repositório
   - Selecione "GitHub Actions" como source
   - O deploy é automático a cada push

2. **Build Local**:
```bash
# Clone o repositório
git clone <repository-url>
cd rare

# Instale as dependências
npm install

# Gere os arquivos estáticos
npm run build

# Teste localmente (opcional)
cd dist && python3 -m http.server 8080
```

### Desenvolvimento Local (Express.js)
```bash
# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Códigos de Convite Válidos
- `RARITY2025`
- `EXCLUSIVE`
- `LUXE`
- `MYSTIQUE`
- `ELITE`

## 🛍️ Produtos de Exemplo

### Kyoto Moonstone Teacup
- **Origem**: Kyoto, Japão
- **Preço**: R$ 2.850
- **História**: Forjada à mão pelo mestre artesão Takeshi Yamamoto nas colinas nebulosas de Kyoto. Apenas 5 peças foram criadas este ano sob a lua cheia.

### Venetian Glass Phoenix
- **Origem**: Murano, Itália  
- **Preço**: R$ 4.200
- **História**: Soprada pelo último mestre remanescente da antiga técnica veneziana da fênix. Esta peça levou 72 horas para ser concluída.

### Swiss Midnight Chronometer
- **Origem**: Genebra, Suíça
- **Preço**: R$ 12.500
- **História**: Criado nas profundezas do inverno pelo relojoeiro suíço Henri Dubois. Cada engrenagem foi individualmente esculpida.

## 🎨 Tecnologias Utilizadas

### GitHub Pages (Estático)
- **Frontend**: HTML estático + Vanilla JavaScript
- **Build**: Node.js script para gerar HTML a partir de EJS
- **Styling**: CSS3 com variáveis customizadas
- **Autenticação**: localStorage para controle de acesso
- **Deploy**: GitHub Actions automático

### Vercel (Serverless) 
- **Backend**: Node.js + Express (serverless)
- **Frontend**: EJS Templates + Vanilla JavaScript
- **Styling**: CSS3 com variáveis customizadas
- **Sessões**: Cookies para controle de acesso
- **Utilitários**: Moment.js para manipulação de datas

## 🔧 Estrutura do Projeto

```
rare/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para deploy
├── public/
│   ├── css/
│   │   └── style.css          # Estilos luxuosos e responsivos
│   ├── js/
│   │   ├── main.js            # Funcionalidades para Vercel
│   │   └── main-static.js     # Funcionalidades para GitHub Pages
│   └── images/
├── views/
│   ├── invitation.ejs         # Página de convite exclusivo
│   ├── index.ejs             # Coleção principal
│   ├── product.ejs           # Detalhes do produto
│   └── gone.ejs              # Página "desapareceu para sempre"
├── api/
│   └── index.js              # API serverless para Vercel
├── dist/                     # Arquivos estáticos gerados (GitHub Pages)
├── build.js                  # Script de build para gerar estáticos
├── server.js                 # Servidor local para desenvolvimento
├── package.json             # Dependências e scripts
└── README.md                # Este arquivo
```

## 🎯 Funcionalidades Especiais

### Micro-Interações
- **Produtos Esgotados**: Desaparecem completamente da plataforma
- **Animações Sutis**: Hover effects e transições suaves
- **Feedback Visual**: Estados de loading e confirmação
- **Easter Egg**: Código Konami para membros ultra-exclusivos

### Elementos de Urgência
- **Timers em Tempo Real**: Contagem regressiva até o fim da disponibilidade
- **Ticker de Compras**: Feed ao vivo de aquisições recentes
- **Badges de Escassez**: Indicadores visuais de quantidade limitada

### Experiência Mobile
- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis
- **Touch Interactions**: Otimizado para interações touch
- **Performance**: Carregamento rápido e animações fluidas

## 🎨 Paleta de Cores

```css
--primary-black: #0a0a0a      /* Fundo principal */
--secondary-black: #1a1a1a    /* Elementos secundários */
--accent-gold: #d4af37        /* Detalhes dourados */
--accent-emerald: #50c878     /* Elementos de urgência */
--text-primary: #ffffff       /* Texto principal */
--text-secondary: #cccccc     /* Texto secundário */
```

## 📱 Responsividade

O site é totalmente responsivo e oferece uma experiência consistente em:
- 📱 **Mobile**: 320px - 768px
- 💻 **Tablet**: 768px - 1024px  
- 🖥️ **Desktop**: 1024px+

## 🔒 Segurança & Privacidade

- Sessões seguras com express-session
- Validação de códigos de convite
- Proteção contra acesso não autorizado
- Dados sensíveis não expostos no frontend

## 🚀 Próximos Passos

### Para GitHub Pages
- ✅ **Build System**: Conversão automática EJS → HTML
- ✅ **Cliente-Side Auth**: localStorage para sessões
- ✅ **GitHub Actions**: Deploy automático
- ✅ **Responsive Design**: Funciona em todos dispositivos

### Para implementação completa em produção
1. **Banco de Dados**: Integrar MongoDB/PostgreSQL
2. **Autenticação**: Sistema completo de usuários
3. **Pagamentos**: Integração com gateways brasileiros
4. **Admin Panel**: Gerenciamento de produtos e convites
5. **Analytics**: Tracking de comportamento e conversões
6. **CDN**: Otimização de imagens e assets
7. **SSL**: Certificados de segurança (GitHub Pages já inclui)
8. **Monitoramento**: Logs e alertas de sistema

---

**© 2025 RARO. Acesso limitado a membros selecionados.**
