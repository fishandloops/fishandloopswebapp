// Fish & Loops - Interactive JavaScript

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Navbar Transparency on Scroll
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add solid background after scrolling
    if (scrollTop > 100) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('navbar-solid');
    } else {
        navbar.classList.remove('navbar-solid');
        navbar.classList.add('navbar-transparent');
    }
    
    lastScrollTop = scrollTop;
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.add('hidden');
            error.textContent = '';
        });
        
        // Hide previous status messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Validate name
        if (name.value.trim().length < 2) {
            showError(name, 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        // If form is valid, submit to PHP
        if (isValid) {
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            
            try {
                // Create FormData object
                const formData = new FormData(contactForm);
                
                // Send form data to PHP script
                const response = await fetch('send-email.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    successMessage.classList.remove('hidden');
                    document.getElementById('success-text').textContent = result.message;
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide success message after 7 seconds
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 7000);
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Show error message
                    errorMessage.classList.remove('hidden');
                    document.getElementById('error-text').textContent = result.message;
                    
                    // Hide error message after 7 seconds
                    setTimeout(() => {
                        errorMessage.classList.add('hidden');
                    }, 7000);
                }
            } catch (error) {
                // Show error message for network issues
                errorMessage.classList.remove('hidden');
                document.getElementById('error-text').textContent = 'Network error. Please check your connection and try again.';
                
                // Hide error message after 7 seconds
                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 7000);
                
                console.error('Form submission error:', error);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }
    });
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        input.classList.add('border-red-400');
        
        // Remove error styling on input
        input.addEventListener('input', function() {
            input.classList.remove('border-red-400');
            errorElement.classList.add('hidden');
        }, { once: true });
    }
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            scrollTopBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            scrollTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
            scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-accent');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-accent');
        }
    });
});

// Animated Background Particles
function createParticles() {
    const hero = document.querySelector('#home');
    if (!hero) return;
    
    // Create additional floating particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle floating';
        
        // Random size
        const size = Math.random() * 200 + 100;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random color
        const colors = [
            'rgba(0, 198, 255, 0.1)',
            'rgba(139, 92, 246, 0.1)',
            'rgba(236, 72, 153, 0.1)',
            'rgba(16, 185, 129, 0.1)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
        
        hero.querySelector('.absolute.inset-0').appendChild(particle);
    }
}

// Initialize particles on load
window.addEventListener('load', createParticles);

// Typing Effect for Hero Text (Optional Enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.card-hover');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.particle');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add animation delay to service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('#services .fade-in');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Console greeting
console.log('%c Fish & Loops ', 'background: #00C6FF; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Engineering Future Systems ', 'background: #8B5CF6; color: white; font-size: 14px; padding: 5px; border-radius: 3px;');
console.log('Interested in the code? Check out the repository or get in touch!');

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Don't trigger keyboard navigation when typing in input fields, textareas, or contenteditable elements
    const isTyping = e.target.tagName === 'INPUT' || 
                     e.target.tagName === 'TEXTAREA' || 
                     e.target.isContentEditable;
    
    if (isTyping) return;
    
    // Press 'H' to go to home
    if (e.key === 'h' || e.key === 'H') {
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
    // Press 'A' to go to about
    if (e.key === 'a' || e.key === 'A') {
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    }
    // Press 'S' to go to services
    if (e.key === 's' || e.key === 'S') {
        document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
    }
    // Press 'C' to go to contact
    if (e.key === 'c' || e.key === 'C') {
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        console.log('🎉 You found the secret! 🎉');
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});
