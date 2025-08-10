const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();

// Fallback HTML templates for when EJS fails in Vercel
const fallbackTemplates = {
  invitation: (error = null) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso Exclusivo | RARO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="invitation-body">
    <div class="invitation-container">
        <div class="invitation-content">
            <h1 class="invitation-title">RARO</h1>
            <p class="invitation-subtitle">Por convite apenas.</p>
            
            <div class="invitation-description">
                <p>Acesso restrito.</p>
                <p>Coleção privada.</p>
            </div>

            <form class="invitation-form" method="POST" action="/invitation">
                <div class="form-group">
                    <label for="code" class="form-label">Código de Convite</label>
                    <input type="text" id="code" name="code" class="form-input" placeholder="Digite seu código" required>
                </div>
                ${error ? `<div class="error-message">${error}</div>` : ''}
                <button type="submit" class="form-submit">Acessar</button>
            </form>
        </div>
    </div>
</body>
</html>`,
  
  gone: () => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Esgotado | RARO</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="gone-body">
    <div class="gone-container">
        <h1>Esgotado</h1>
        <p>Esta peça única já foi adquirida.</p>
        <a href="/" class="back-link">Voltar à coleção</a>
    </div>
</body>
</html>`,

  index: (products) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coleção Exclusiva | RARO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="logo">RARO</h1>
                <p class="tagline">Coleção 2025.</p>
                <nav class="nav">
                    <a href="/" class="nav-link active">Coleção</a>
                    <a href="/logout" class="nav-link">Sair</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <section class="hero">
                <h2 class="hero-title">Coleção Atual</h2>
                <p class="hero-subtitle">Peças selecionadas. Quantidades limitadas.</p>
            </section>

            <section class="products">
                <div class="products-grid">
                    ${products.map(product => `
                        <article class="product-card">
                            <div class="product-header">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-origin">${product.origin}</p>
                            </div>
                            
                            <div class="product-story">
                                <p>${product.story}</p>
                            </div>
                            
                            <div class="product-details">
                                <div class="product-price">
                                    <span class="currency">${product.currency}</span>
                                    <span class="amount">${product.price.toLocaleString('pt-BR')}</span>
                                </div>
                                
                                <div class="product-quantity">
                                    <span class="quantity-label">Disponível:</span>
                                    <span class="quantity-value">${product.quantity}</span>
                                </div>
                            </div>
                            
                            <a href="/product/${product.id}" class="product-link">Ver Detalhes</a>
                        </article>
                    `).join('')}
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p class="footer-text"> 2025 RARO.</p>
        </div>
    </footer>
</body>
</html>`
};

// Middleware
app.set('view engine', 'ejs');

// Multiple path attempts for Vercel serverless compatibility
const possibleViewsPaths = [
  path.resolve(__dirname, '../views'),
  path.resolve(process.cwd(), 'views'),
  path.join(__dirname, '../views'),
  './views'
];

let viewsPath = null;
for (const testPath of possibleViewsPaths) {
  if (fs.existsSync(testPath)) {
    viewsPath = testPath;
    console.log('Found views at:', viewsPath);
    break;
  }
}

if (!viewsPath) {
  console.error('Views directory not found! Checked paths:', possibleViewsPaths);
}

app.set('views', viewsPath || path.resolve(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Valid invitation codes
const validCodes = ['RARITY2025', 'EXCLUSIVE', 'LUXE', 'MYSTIQUE', 'ELITE'];

// Mock product data - Luxury Fashion & Jewelry Collection
const products = [
  {
    id: 1,
    name: 'Hermès Birkin Himalaya Crocodile',
    price: 285000,
    currency: 'BRL',
    quantity: 1,
    origin: 'Paris, France',
    story: 'A única bolsa Birkin Himalaya disponível no Brasil. Confeccionada em couro de crocodilo nilótico albino, com ferragens de ouro branco 18k e diamantes. Apenas 12 peças existem no mundo.',
    category: 'Handbags',
    available: true,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop'
  },
  {
    id: 2,
    name: 'Patek Philippe Grandmaster Chime',
    price: 1250000,
    currency: 'BRL',
    quantity: 1,
    origin: 'Geneva, Switzerland',
    story: 'O relógio mais complicado já criado pela Patek Philippe. Possui 20 complicações, incluindo 5 funções de carrilhão. Apenas 7 exemplares foram produzidos para colecionadores privados.',
    category: 'Timepieces',
    available: true,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&h=500&fit=crop'
  },
  {
    id: 3,
    name: 'Chanel Haute Couture Evening Gown',
    price: 95000,
    currency: 'BRL',
    quantity: 1,
    origin: 'Paris, France',
    story: 'Vestido exclusivo da coleção Haute Couture 2025. Bordado à mão com fios de ouro 24k e pérolas Mikimoto. Criado especialmente para uma cliente anônima que desistiu da compra.',
    category: 'Haute Couture',
    available: true,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop'
  },
  {
    id: 4,
    name: 'Tiffany & Co. Blue Diamond Necklace',
    price: 450000,
    currency: 'BRL',
    quantity: 1,
    origin: 'New York, USA',
    story: 'Colar com diamante azul de 15 quilates, classificação VVS1. Montado em platina com diamantes brancos de apoio. Peça única da coleção Blue Book 2025.',
    category: 'Fine Jewelry',
    available: true,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop'
  },
  {
    id: 5,
    name: 'Tom Ford Bespoke Smoking Jacket',
    price: 35000,
    currency: 'BRL',
    quantity: 1,
    origin: 'London, England',
    story: 'Smoking jacket sob medida em veludo de seda italiana. Lapelas em cetim com bordados em fio de prata. Encomendado por um magnata europeu, nunca retirado do ateliê.',
    category: 'Menswear',
    available: true,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop'
  },
  {
    id: 6,
    name: 'Louboutin Crystal-Encrusted Heels',
    price: 28000,
    currency: 'BRL',
    quantity: 1,
    origin: 'Paris, France',
    story: 'Sapatos exclusivos com mais de 3.000 cristais Swarovski aplicados à mão. Salto de 12cm em titânio. Criados para o Met Gala 2025, nunca usados.',
    category: 'Footwear',
    available: true,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop'
  }
];

// Simple session simulation using query parameters for Vercel
function hasAccess(req) {
  return req.query.access === 'granted' || req.cookies?.access === 'granted';
}

// Routes
app.get('/', (req, res) => {
  if (!hasAccess(req)) {
    return res.redirect('/invitation');
  }
  
  try {
    const availableProducts = products.filter(p => p.available);
    // Add missing recentPurchases data that EJS template expects
    const recentPurchases = [
      { item: 'Hermès Birkin Himalaya Crocodile', buyer: 'Colecionador Anônimo', time: '2h atrás' },
      { item: 'Patek Philippe Grandmaster Chime', buyer: 'Investidor Privado', time: '5h atrás' },
      { item: 'Chanel Haute Couture Evening Gown', buyer: 'Magnata Tech', time: '1d atrás' }
    ];
    res.render('index', { products: availableProducts, recentPurchases });
  } catch (error) {
    console.error('EJS render failed for index, using fallback HTML:', error);
    const availableProducts = products.filter(p => p.available);
    res.send(fallbackTemplates.index(availableProducts));
  }
});

app.get('/invitation', (req, res) => {
  try {
    res.render('invitation', { error: null });
  } catch (error) {
    console.error('EJS render failed, using fallback HTML:', error);
    res.send(fallbackTemplates.invitation());
  }
});

app.post('/invitation', (req, res) => {
  try {
    const { code } = req.body;
    
    if (validCodes.includes(code.toUpperCase())) {
      res.cookie('access', 'granted', { maxAge: 24 * 60 * 60 * 1000 });
      return res.redirect('/?access=granted');
    }
    
    try {
      res.render('invitation', { error: 'Código inválido. Acesso negado.' });
    } catch (ejsError) {
      console.error('EJS render failed, using fallback HTML:', ejsError);
      res.send(fallbackTemplates.invitation('Código inválido. Acesso negado.'));
    }
  } catch (error) {
    console.error('Error in invitation post:', error);
    res.send(fallbackTemplates.invitation('Erro interno. Tente novamente.'));
  }
});

app.get('/product/:id', (req, res) => {
  if (!hasAccess(req)) {
    return res.redirect('/invitation');
  }
  
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).render('gone');
    }
    
    if (!product.available) {
      return res.render('gone');
    }
    
    res.render('product', { product });
  } catch (error) {
    console.error('Error rendering product:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('access');
  res.redirect('/invitation');
});

app.get('/gone', (req, res) => {
  try {
    res.render('gone');
  } catch (error) {
    console.error('EJS render failed, using fallback HTML:', error);
    res.send(fallbackTemplates.gone());
  }
});

// Debug route for Vercel
app.get('/debug', (req, res) => {
  const debugInfo = {
    __dirname,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL,
    currentViewsPath: app.get('views'),
    possiblePaths: {}
  };
  
  // Check all possible paths
  possibleViewsPaths.forEach(testPath => {
    debugInfo.possiblePaths[testPath] = {
      exists: fs.existsSync(testPath),
      resolved: path.resolve(testPath)
    };
  });
  
  try {
    debugInfo.apiDirFiles = fs.readdirSync(__dirname);
    debugInfo.rootDirFiles = fs.readdirSync(process.cwd());
    
    // Try to list views directory if found
    if (viewsPath && fs.existsSync(viewsPath)) {
      debugInfo.viewFiles = fs.readdirSync(viewsPath);
    }
  } catch (e) {
    debugInfo.filesError = e.message;
  }
  
  res.json(debugInfo);
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
