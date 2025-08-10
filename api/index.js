const express = require('express');
const path = require('path');
const fs = require('fs');

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
            <p class="footer-text">© 2025 RARO.</p>
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

// Valid invitation codes
const validCodes = ['RARITY2025', 'EXCLUSIVE', 'LUXE', 'MYSTIQUE', 'ELITE'];

// Mock product data
const products = [
  {
    id: 1,
    name: 'Kyoto Moonstone Teacup',
    price: 2850,
    currency: 'BRL',
    quantity: 2,
    origin: 'Kyoto, Japan',
    story: 'Hand-forged by master artisan Takeshi Yamamoto in the misty hills of Kyoto. Only 5 pieces were created this year under the full moon, each containing fragments of genuine moonstone.',
    category: 'Ceramics',
    available: true,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: 'Venetian Glass Phoenix',
    price: 4200,
    currency: 'BRL',
    quantity: 1,
    origin: 'Murano, Italy',
    story: 'Blown by the last remaining master of the ancient Venetian phoenix technique. This piece took 72 hours to complete and will never be replicated.',
    category: 'Glass',
    available: true,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: 'Swiss Midnight Watch',
    price: 12500,
    currency: 'BRL',
    quantity: 1,
    origin: 'Geneva, Switzerland',
    story: 'Crafted by the legendary watchmaker Henri Dubois. This timepiece contains a movement that was assembled during a total solar eclipse, believed to capture time itself.',
    category: 'Timepieces',
    available: true,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString()
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
    res.render('index', { products: availableProducts });
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
