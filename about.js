document.addEventListener("DOMContentLoaded", () => {
    // DevTools Protection with Password
    const DEVTOOLS_PASSWORD = 'Siddharth';
    let isDevToolsAllowed = false;
    
    // Block all default DevTools access methods
    function blockDevTools(e) {
        if (!isDevToolsAllowed) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Block right-click
    document.addEventListener('contextmenu', blockDevTools);
    
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            blockDevTools(e);
        }
    }, true);

    // Only allow access through Shift+Alt+P
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.altKey && e.key === 'P') {
            e.preventDefault();
            const password = prompt('Enter DevTools password:');
            if (password === DEVTOOLS_PASSWORD) {
                isDevToolsAllowed = true;
                alert('DevTools access granted! You can now use F12 key.');
            } else {
                alert('Incorrect password!');
            }
        }
    });

    // Initialize ripple effect
    $('body').ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.02,
        interactive: true,
        crossOrigin: '',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80'
    });

    // Apply the dark overlay to the ripple canvas
    const rippleCanvas = document.querySelector('canvas');
    if (rippleCanvas) {
        rippleCanvas.style.filter = 'brightness(0.6) contrast(1.2)';
        rippleCanvas.style.opacity = '0.85';
    }

    // Subtle hover sound
    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3');
    const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-interface-click-2568.mp3');

    // Add sound effects to back link
    const backLink = document.querySelector('.back-link');
    backLink.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = 0.1;
        hoverSound.play().catch(() => {});
    });

    backLink.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.volume = 0.1;
        clickSound.play().catch(() => {});
    });
}); 