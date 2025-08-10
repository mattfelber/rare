// RARO Luxury Site - Advanced UX/UI Functionality
// Design Engineering Lead Implementation

// Global state management
const LuxuryState = {
    wishlist: JSON.parse(localStorage.getItem('raro_wishlist') || '[]'),
    viewHistory: JSON.parse(localStorage.getItem('raro_view_history') || '[]'),
    currentProduct: null
};

// Modal Management
function openAcquireModal(productId) {
    LuxuryState.currentProduct = productId;
    const modal = document.getElementById('acquireModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track high-intent action
    trackLuxuryEvent('acquire_modal_opened', { product_id: productId });
}

function openInquiryModal(productId) {
    LuxuryState.currentProduct = productId;
    const modal = document.getElementById('inquiryModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track inquiry interest
    trackLuxuryEvent('inquiry_modal_opened', { product_id: productId });
}

function closeLuxuryModal(modalId) {
    const modal = document.getElementById(modalId);
    
    // Elegant exit animation
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        modal.style.opacity = '1';
    }, 200);
}

// Wishlist Management
function toggleWishlist(productId) {
    const button = event.target.closest('.wishlist-button');
    const icon = button.querySelector('.wishlist-icon');
    
    if (LuxuryState.wishlist.includes(productId)) {
        // Remove from wishlist
        LuxuryState.wishlist = LuxuryState.wishlist.filter(id => id !== productId);
        button.classList.remove('active');
        icon.textContent = '♡';
        showLuxuryNotification('Removido dos favoritos', 'info');
    } else {
        // Add to wishlist
        LuxuryState.wishlist.push(productId);
        button.classList.add('active');
        icon.textContent = '♥';
        showLuxuryNotification('Adicionado aos favoritos', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('raro_wishlist', JSON.stringify(LuxuryState.wishlist));
    trackLuxuryEvent('wishlist_toggle', { product_id: productId, action: LuxuryState.wishlist.includes(productId) ? 'add' : 'remove' });
}

// Luxury Notifications
function showLuxuryNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `luxury-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// VIP Form Handling
function handleVIPForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Simulate VIP process initiation
    showLuxuryNotification('Processo VIP iniciado. Nossa equipe entrará em contato em até 2 horas.', 'success');
    
    // Track high-value lead
    trackLuxuryEvent('vip_form_submitted', {
        product_id: LuxuryState.currentProduct,
        net_worth: formData.get('net_worth')
    });
    
    closeLuxuryModal('acquireModal');
}

function handleInquiryForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Simulate inquiry submission
    showLuxuryNotification('Consultoria solicitada. Rafael Cavalcanti entrará em contato em breve.', 'success');
    
    trackLuxuryEvent('inquiry_form_submitted', {
        product_id: LuxuryState.currentProduct,
        contact_method: formData.get('contact')
    });
    
    closeLuxuryModal('inquiryModal');
}

// Product View Tracking
function trackProductView(productId) {
    const timestamp = new Date().toISOString();
    const viewEntry = { product_id: productId, timestamp };
    
    // Add to view history (keep last 50)
    LuxuryState.viewHistory.unshift(viewEntry);
    LuxuryState.viewHistory = LuxuryState.viewHistory.slice(0, 50);
    
    localStorage.setItem('raro_view_history', JSON.stringify(LuxuryState.viewHistory));
    trackLuxuryEvent('product_viewed', { product_id: productId });
}

// Luxury Analytics
function trackLuxuryEvent(eventName, data = {}) {
    // Enhanced analytics for luxury clientele
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...data
    };
    
    // In production, send to analytics service
    console.log('Luxury Analytics:', eventData);
    
    // Store locally for demo
    const events = JSON.parse(localStorage.getItem('raro_analytics') || '[]');
    events.push(eventData);
    localStorage.setItem('raro_analytics', JSON.stringify(events.slice(-100)));
}

// Session Management
function getSessionId() {
    let sessionId = sessionStorage.getItem('raro_session_id');
    if (!sessionId) {
        sessionId = 'raro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('raro_session_id', sessionId);
    }
    return sessionId;
}

// Luxury Timer Enhancement
function initializeLuxuryTimers() {
    const timers = document.querySelectorAll('[data-end-time]');
    
    timers.forEach(timer => {
        const endTime = new Date(timer.dataset.endTime);
        
        function updateTimer() {
            const now = new Date();
            const timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                timer.innerHTML = '<span style="color: #ff6b6b;">Oferta Expirada</span>';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerValue = timer.querySelector('.timer-value');
            if (timerValue) {
                timerValue.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    });
}

// Luxury Scrolling Effects
function initializeLuxuryScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('luxury-animate-in');
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize wishlist state on page load
function initializeWishlistState() {
    document.querySelectorAll('.wishlist-button').forEach(button => {
        const productId = button.dataset.productId;
        if (LuxuryState.wishlist.includes(productId)) {
            button.classList.add('active');
            button.querySelector('.wishlist-icon').textContent = '♥';
        }
    });
}

// Keyboard shortcuts for power users
function initializeLuxuryKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.luxury-modal.show');
            if (openModal) {
                closeLuxuryModal(openModal.id);
            }
        }
        
        // Ctrl/Cmd + K for quick search (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Future: Open quick search modal
            console.log('Quick search shortcut (future feature)');
        }
    });
}

// Initialize all luxury features on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 RARO Luxury Experience Initialized');
    
    // Initialize core features
    initializeLuxuryTimers();
    initializeLuxuryScrollEffects();
    initializeWishlistState();
    initializeLuxuryKeyboardShortcuts();
    
    // Track page view
    const productId = document.querySelector('[data-product-id]')?.dataset.productId;
    if (productId) {
        trackProductView(productId);
    }
    
    // Add form event listeners
    const vipForm = document.querySelector('.vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', handleVIPForm);
    }
    
    const inquiryForm = document.querySelector('.inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiryForm);
    }
    
    // Add luxury loading complete effect
    document.body.classList.add('luxury-loaded');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openAcquireModal,
        openInquiryModal,
        closeLuxuryModal,
        toggleWishlist,
        trackLuxuryEvent
    };
}
