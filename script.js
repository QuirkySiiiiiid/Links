document.addEventListener("DOMContentLoaded", () => {
    // Initialize ripple effect with subtle waves and background image
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
        rippleCanvas.style.opacity = '0.85';  // Match the overlay opacity
    }

    // Create gentle circular ripples at random positions
    setInterval(function() {
        const x = Math.random() * $('body').width();
        const y = Math.random() * $('body').height();
        const dropRadius = 15 + Math.random() * 10;
        const strength = 0.02 + Math.random() * 0.01;

        $('body').ripples('drop', x, y, dropRadius, strength);
    }, 3000);

    // Click effect for intentional ripples
    $(document).on('click', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        const dropRadius = 20;
        const strength = 0.03;
        
        $('body').ripples('drop', x, y, dropRadius, strength);
    });

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

    // Touch support for magnetic effect
    const links = document.querySelectorAll(".link");
    const profilePic = document.querySelector(".profile-pic");
    
    // Detect RTL
    const isRTL = document.documentElement.dir === 'rtl';

    // Subtle hover sound
    const hoverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3');
    const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-interface-click-2568.mp3');

    links.forEach(link => {
        // Touch and mouse events
        const handleInteraction = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            const bounds = link.getBoundingClientRect();
            const mouseX = touch.clientX - bounds.left;
            const mouseY = touch.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const deltaX = (mouseX - centerX) * 0.15;
            const deltaY = (mouseY - centerY) * 0.15;

            link.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        };

        link.addEventListener("mousemove", handleInteraction);
        link.addEventListener("touchmove", handleInteraction, { passive: true });

        link.addEventListener("mouseleave", () => {
            link.style.transform = "";
        });

        link.addEventListener("touchend", () => {
            link.style.transform = "";
        });

        // Sound effects with user interaction check
        const playSound = (sound) => {
            if (window.innerWidth > 768) {  // Only play on larger screens
                sound.currentTime = 0;
                sound.volume = 0.1;
                const playPromise = sound.play();
                if (playPromise) {
                    playPromise.catch(() => {});
                }
            }
        };

        link.addEventListener("mouseenter", () => playSound(hoverSound));
        
        link.addEventListener("click", (e) => {
            e.preventDefault();
            playSound(clickSound);

            link.style.transform = "scale(0.95)";
            setTimeout(() => link.style.transform = "", 200);
            
            // Show success message and navigate
            showSuccessMessage("Opening link...");
            setTimeout(() => {
                window.location.href = link.href;
            }, 1000);
        });
    });

    // Enhanced profile picture interaction
    let rotationDegree = 0;
    profilePic.addEventListener("click", () => {
        rotationDegree += 360;
        profilePic.style.transform = `scale(1.1) rotate(${rotationDegree}deg)`;
        setTimeout(() => {
            profilePic.style.transform = `rotate(${rotationDegree}deg)`;
        }, 1000);
    });

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-animation';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        requestAnimationFrame(() => {
            successDiv.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            successDiv.style.transform = 'translateX(200%)';
            setTimeout(() => successDiv.remove(), 400);
        }, 2000);
    }

    // Hamburger Menu
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
        if(!menuOpen) {
            menuBtn.classList.add('open');
            navMenu.classList.add('active');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            navMenu.classList.remove('active');
            menuOpen = false;
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navMenu.contains(e.target) && menuOpen) {
            menuBtn.classList.remove('open');
            navMenu.classList.remove('active');
            menuOpen = false;
        }
    });

    // Add hover sound to menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => playSound(hoverSound));
        link.addEventListener('click', (e) => {
            playSound(clickSound);
            
            // Close the menu
            menuBtn.classList.remove('open');
            navMenu.classList.remove('active');
            menuOpen = false;

            // If it's not the home link, prevent default and open in new tab
            if (link.getAttribute('target') === '_blank') {
                e.preventDefault();
                window.open(link.href, '_blank');
            }
        });

        // Add magnetic effect
        const handleMenuLinkInteraction = (e) => {
            const bounds = link.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const deltaX = (mouseX - centerX) * 0.15;
            const deltaY = (mouseY - centerY) * 0.15;

            link.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        };

        link.addEventListener("mousemove", handleMenuLinkInteraction);
        link.addEventListener("mouseleave", () => {
            link.style.transform = "";
        });
    });

    // Add this inside your DOMContentLoaded event listener, after the existing code
    const menuBtnBurger = document.querySelector('.menu-btn');

    // Magnetic effect for hamburger menu
    const handleBurgerInteraction = (e) => {
        const bounds = menuBtnBurger.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        
        const deltaX = (mouseX - centerX) * 0.15;
        const deltaY = (mouseY - centerY) * 0.15;

        menuBtnBurger.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    menuBtnBurger.addEventListener("mousemove", handleBurgerInteraction);
    menuBtnBurger.addEventListener("mouseleave", () => {
        menuBtnBurger.style.transform = "";
    });

    // Add this to your existing click handler for the close button
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navMenu.classList.remove('active');
        menuOpen = false;
    });

    // Floating Action Button functionality
    const fabContainer = document.querySelector('.fab-container');
    const mainFab = document.querySelector('.main-fab');
    const fabOptions = document.querySelectorAll('.fab-option');

    // Initialize FAB state
    let isFabOpen = false;

    mainFab.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent event bubbling
        isFabOpen = !isFabOpen;
        fabContainer.classList.toggle('active');
        
        // Rotate main button
        mainFab.style.transform = isFabOpen ? 'rotate(135deg)' : '';
        mainFab.style.background = isFabOpen ? 'var(--text-primary)' : 'var(--accent-color)';
        
        playSound(clickSound);
    });

    fabOptions.forEach((option, index) => {
        // Set initial position
        option.style.transitionDelay = isFabOpen ? `${index * 0.1}s` : '0s';
        
        option.addEventListener('mouseenter', () => playSound(hoverSound));
        option.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent event bubbling
            playSound(clickSound);
            
            // Show success message based on the button clicked
            const action = option.title;
            showSuccessMessage(`Opening ${action}...`);
            
            // Close the FAB menu
            fabContainer.classList.remove('active');
            mainFab.style.transform = '';
            mainFab.style.background = 'var(--accent-color)';
            isFabOpen = false;

            // Navigate after a short delay
            setTimeout(() => {
                window.location.href = option.href;
            }, 500);
        });
    });

    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isFabOpen && !fabContainer.contains(e.target)) {
            fabContainer.classList.remove('active');
            mainFab.style.transform = '';
            mainFab.style.background = 'var(--accent-color)';
            fabOptions.forEach(option => {
                option.style.transitionDelay = '0s';
            });
            isFabOpen = false;
        }
    });

    // Add magnetic effect to FAB buttons
    const fabButtons = document.querySelectorAll('.fab-button');
    fabButtons.forEach(button => {
        const handleFabInteraction = (e) => {
            const bounds = button.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const deltaX = (mouseX - centerX) * 0.15;
            const deltaY = (mouseY - centerY) * 0.15;

            const isMainFab = button.classList.contains('main-fab');
            const rotation = isMainFab && isFabOpen ? ' rotate(135deg)' : '';
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)${rotation}`;
        };

        button.addEventListener("mousemove", handleFabInteraction);
        button.addEventListener("mouseleave", () => {
            const isMainFab = button.classList.contains('main-fab');
            button.style.transform = isMainFab && isFabOpen ? 'rotate(135deg)' : '';
        });
    });
}); 