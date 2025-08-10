const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

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
    console.error('Error rendering index:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/invitation', (req, res) => {
  try {
    res.render('invitation', { error: null });
  } catch (error) {
    console.error('Error rendering invitation:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/invitation', (req, res) => {
  try {
    const { code } = req.body;
    
    if (validCodes.includes(code.toUpperCase())) {
      res.cookie('access', 'granted', { maxAge: 24 * 60 * 60 * 1000 });
      return res.redirect('/?access=granted');
    }
    
    res.render('invitation', { error: 'Código inválido. Acesso negado.' });
  } catch (error) {
    console.error('Error in invitation post:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
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
    console.error('Error rendering gone:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
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

// Export for Vercel - both app and handler
module.exports = app;
module.exports.default = app;
