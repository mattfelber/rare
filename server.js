const express = require('express');
const session = require('express-session');
const path = require('path');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'exclusive-marketplace-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Valid invitation codes (in production, this would be in a database)
const validCodes = ['RARITY2025', 'EXCLUSIVE', 'LUXE', 'MYSTIQUE', 'ELITE'];

// Mock product data with scarcity and luxury appeal
const products = [
  {
    id: 1,
    name: 'Kyoto Moonstone Teacup',
    price: 2850,
    currency: 'BRL',
    quantity: 2,
    origin: 'Kyoto, Japan',
    story: 'Hand-forged by master artisan Takeshi Yamamoto in the misty hills of Kyoto. Only 5 pieces were created this year under the full moon, each containing fragments of genuine moonstone.',
    image: 'https://picsum.photos/400/250?random=1&grayscale',
    category: 'Ceramics',
    available: true,
    endTime: moment().add(2, 'days').add(14, 'hours').toISOString()
  },
  {
    id: 2,
    name: 'Venetian Glass Phoenix',
    price: 4200,
    currency: 'BRL',
    quantity: 1,
    origin: 'Murano, Italy',
    story: 'Blown by the last remaining master of the ancient Venetian phoenix technique. This piece took 72 hours to complete and will never be replicated.',
    image: 'https://picsum.photos/400/250?random=2&grayscale',
    category: 'Glass Art',
    available: true,
    endTime: moment().add(1, 'day').add(8, 'hours').toISOString()
  },
  {
    id: 3,
    name: 'Swiss Midnight Chronometer',
    price: 12500,
    currency: 'BRL',
    quantity: 3,
    origin: 'Geneva, Switzerland',
    story: 'Crafted in the depths of winter by Swiss horologist Henri Dubois. Each gear was individually carved from meteorite fragments found in the Alps.',
    image: 'https://picsum.photos/400/250?random=3&grayscale',
    category: 'Timepieces',
    available: true,
    endTime: moment().add(3, 'days').add(6, 'hours').toISOString()
  }
];

// Recent purchases for social proof
const recentPurchases = [
  { item: 'Parisian Silk Scarf', buyer: 'M***a from São Paulo', time: '12 minutes ago' },
  { item: 'Tibetan Singing Bowl', buyer: 'C***s from Rio de Janeiro', time: '1 hour ago' },
  { item: 'Scottish Cashmere Throw', buyer: 'A***e from Brasília', time: '3 hours ago' }
];

// Middleware to check invitation code
function requireInvitation(req, res, next) {
  if (req.session.hasAccess) {
    return next();
  }
  res.redirect('/invitation');
}

// Routes
app.get('/', (req, res) => {
  if (!req.session.hasAccess) {
    return res.redirect('/invitation');
  }
  
  const availableProducts = products.filter(p => p.available && p.quantity > 0);
  res.render('index', { 
    products: availableProducts, 
    recentPurchases,
    moment 
  });
});

app.get('/invitation', (req, res) => {
  res.render('invitation', { error: null });
});

app.post('/invitation', (req, res) => {
  const { code } = req.body;
  
  if (validCodes.includes(code.toUpperCase())) {
    req.session.hasAccess = true;
    req.session.invitationCode = code;
    return res.redirect('/');
  }
  
  res.render('invitation', { 
    error: 'Código inválido. A raridade não pode ser forçada.' 
  });
});

app.get('/product/:id', requireInvitation, (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  
  if (!product || !product.available || product.quantity <= 0) {
    return res.render('gone', { 
      message: 'Desapareceu para sempre. Você nunca mais verá isso novamente.' 
    });
  }
  
  res.render('product', { product, moment });
});

app.post('/purchase/:id', requireInvitation, (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  
  if (!product || !product.available || product.quantity <= 0) {
    return res.json({ success: false, message: 'Produto não disponível' });
  }
  
  // Simulate purchase
  product.quantity -= 1;
  
  if (product.quantity === 0) {
    product.available = false;
  }
  
  // Add to recent purchases
  recentPurchases.unshift({
    item: product.name,
    buyer: 'Você',
    time: 'agora'
  });
  
  if (recentPurchases.length > 5) {
    recentPurchases.pop();
  }
  
  res.json({ 
    success: true, 
    message: 'Parabéns. Você agora possui algo que poucos no mundo possuem.' 
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/invitation');
});

app.listen(PORT, () => {
  console.log(`Exclusive marketplace running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
