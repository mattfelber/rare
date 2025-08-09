// Countdown Timer Functionality
function updateCountdown(element, endTime) {
    const end = new Date(endTime).getTime();
    
    function update() {
        const now = new Date().getTime();
        const distance = end - now;
        
        if (distance < 0) {
            element.innerHTML = '<span style="color: #ff6b6b;">TEMPO ESGOTADO</span>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (element.classList.contains('countdown-timer')) {
            // Detailed countdown for product page
            element.querySelector('.days').textContent = days.toString().padStart(2, '0');
            element.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
            element.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
            element.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Simple countdown for product cards
            if (days > 0) {
                element.textContent = `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                element.textContent = `${hours}h ${minutes}m`;
            } else {
                element.textContent = `${minutes}m ${seconds}s`;
            }
        }
    }
    
    update();
    return setInterval(update, 1000);
}

// Initialize countdown timers
document.addEventListener('DOMContentLoaded', function() {
    // Product card timers
    const productTimers = document.querySelectorAll('.product-timer');
    productTimers.forEach(timer => {
        const endTime = timer.dataset.endTime;
        const valueElement = timer.querySelector('.timer-value');
        if (endTime && valueElement) {
            updateCountdown(valueElement, endTime);
        }
    });
    
    // Product detail page timer
    const detailTimer = document.querySelector('.countdown-timer');
    if (detailTimer) {
        const endTime = detailTimer.dataset.endTime;
        updateCountdown(detailTimer, endTime);
    }
    
    // Purchase button functionality
    const purchaseButtons = document.querySelectorAll('.purchase-button');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            handlePurchase(productId);
        });
    });
    
    // Recent purchases animation
    animateRecentPurchases();
    
    // Add subtle animations to product cards
    observeProductCards();
});

// Handle purchase functionality
async function handlePurchase(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Processando...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    try {
        const response = await fetch(`/purchase/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showPurchaseModal(result.message);
            
            // Add success animation
            button.style.background = 'linear-gradient(135deg, #50c878, #7dd3a0)';
            button.textContent = 'Adquirido!';
            
            // Update scarcity indicators
            updateScarcityIndicators(productId);
            
        } else {
            showErrorMessage(result.message);
            button.textContent = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }
    } catch (error) {
        console.error('Purchase error:', error);
        showErrorMessage('Erro ao processar compra. Tente novamente.');
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }
}

// Show purchase success modal
function showPurchaseModal(message) {
    const modal = document.getElementById('purchaseModal');
    const messageElement = document.getElementById('purchaseMessage');
    
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'block';
        
        // Add entrance animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Show error message
function showErrorMessage(message) {
    // Create temporary error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update scarcity indicators after purchase
function updateScarcityIndicators(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        const scarcityBadge = productCard.querySelector('.scarcity-badge');
        if (scarcityBadge) {
            // Simulate quantity decrease
            const currentText = scarcityBadge.textContent;
            const currentQuantity = parseInt(currentText.match(/\d+/)[0]);
            const newQuantity = currentQuantity - 1;
            
            if (newQuantity <= 0) {
                // Product sold out - add dramatic effect
                productCard.style.transition = 'all 1s ease';
                productCard.style.opacity = '0.3';
                productCard.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                scarcityBadge.textContent = `Apenas ${newQuantity} ${newQuantity === 1 ? 'restante' : 'restantes'}`;
                scarcityBadge.style.animation = 'pulse 1s ease';
            }
        }
    }
}

// Animate recent purchases ticker
function animateRecentPurchases() {
    const ticker = document.querySelector('.recent-purchases-content');
    if (ticker) {
        // Clone content for seamless loop
        const tickerContent = ticker.innerHTML;
        ticker.innerHTML = tickerContent + tickerContent;
        
        // Add hover pause functionality
        const container = document.querySelector('.recent-purchases');
        if (container) {
            container.addEventListener('mouseenter', () => {
                ticker.style.animationPlayState = 'paused';
            });
            
            container.addEventListener('mouseleave', () => {
                ticker.style.animationPlayState = 'running';
            });
        }
    }
}

// Observe product cards for entrance animations
function observeProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error-notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts for exclusive feel
document.addEventListener('keydown', function(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('purchaseModal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
    
    // Konami code easter egg for extra exclusivity
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiProgress = window.konamiProgress || 0;
    
    if (e.keyCode === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            showSecretMessage();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

// Secret message for ultimate exclusivity
function showSecretMessage() {
    const secretDiv = document.createElement('div');
    secretDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #d4af37, #f4e4a6);
        color: #0a0a0a;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        z-index: 2000;
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        font-weight: 600;
        box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
        animation: fadeIn 0.5s ease;
    `;
    
    secretDiv.innerHTML = `
        <div>✦ MEMBRO ULTRA-EXCLUSIVO ✦</div>
        <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">
            Você descobriu o segredo. Acesso VIP desbloqueado.
        </div>
    `;
    
    document.body.appendChild(secretDiv);
    
    setTimeout(() => {
        secretDiv.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(secretDiv);
        }, 500);
    }, 3000);
}

// Add fade animations
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(fadeStyle);
