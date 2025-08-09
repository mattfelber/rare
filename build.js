const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create output directory
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Product data (same as in server.js)
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
    image: 'https://picsum.photos/400/250?random=2&grayscale',
    category: 'Glass Art',
    available: true,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString()
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
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString()
  }
];

// Recent purchases for social proof
const recentPurchases = [
  { item: 'Parisian Silk Scarf', buyer: 'M***a from São Paulo', time: '12 minutes ago' },
  { item: 'Tibetan Singing Bowl', buyer: 'C***s from Rio de Janeiro', time: '1 hour ago' },
  { item: 'Scottish Cashmere Throw', buyer: 'A***e from Brasília', time: '3 hours ago' }
];

// Mock moment function for date formatting
const moment = (date) => {
  const d = new Date(date);
  return {
    toISOString: () => d.toISOString(),
    add: (amount, unit) => {
      const newDate = new Date(d);
      if (unit === 'days') {
        newDate.setDate(newDate.getDate() + amount);
      } else if (unit === 'hours') {
        newDate.setHours(newDate.getHours() + amount);
      }
      return moment(newDate);
    }
  };
};

// Function to render EJS template
function renderTemplate(templatePath, data, outputPath) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = ejs.render(template, data);
  fs.writeFileSync(outputPath, html);
  console.log(`Generated: ${outputPath}`);
}

// Generate invitation page
renderTemplate(
  path.join(__dirname, 'views/invitation.ejs'),
  { error: null },
  path.join(outputDir, 'invitation.html')
);

// Generate main index page  
renderTemplate(
  path.join(__dirname, 'views/index.ejs'),
  { products, recentPurchases, moment },
  path.join(outputDir, 'index.html')
);

// Read product.ejs template
const productTemplate = fs.readFileSync(path.join(__dirname, 'views/product.ejs'), 'utf8');

// Generate individual product pages
products.forEach(product => {
  const html = ejs.render(productTemplate, { product, moment });
  fs.writeFileSync(path.join(outputDir, `product-${product.id}.html`), html);
  console.log(`Generated: product-${product.id}.html`);
});

// Generate gone page
renderTemplate(
  path.join(__dirname, 'views/gone.ejs'),
  { message: 'Desapareceu para sempre. Você nunca mais verá isso novamente.' },
  path.join(outputDir, 'gone.html')
);

// Copy static assets
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy public directory to dist
copyDirectory(path.join(__dirname, 'public'), outputDir);

// Replace main.js with main-static.js in all HTML files
function updateJavaScriptReferences() {
  const htmlFiles = ['index.html', 'invitation.html', 'product-1.html', 'product-2.html', 'product-3.html', 'gone.html'];
  
  htmlFiles.forEach(filename => {
    const filePath = path.join(outputDir, filename);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace('/js/main.js', '/js/main-static.js');
      fs.writeFileSync(filePath, content);
      console.log(`Updated JavaScript reference in: ${filename}`);
    }
  });
}

updateJavaScriptReferences();

console.log('Static site generated successfully!');