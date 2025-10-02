
'use strict';


document.addEventListener("DOMContentLoaded", () => {
    
    initializeApp();
});

function initializeApp() {
    
    setupPageLoader();
    setupNavigation();
    setupScrollEffects();

    
    setupCursorEffects();
    initParticleBg();
    setup3DTilt();

    
    if (document.body.classList.contains('dashboard-body')) {
        setupDashboardFunctionality();
    } else if (document.querySelector('.login-page')) {
        setupLoginForms();
    } else if (document.querySelector('.choose-system-page')) {
        checkAuth('patient', 'patient-login.html');
        const userNameEl = document.getElementById("patientName");
        if (userNameEl) {
            userNameEl.textContent = localStorage.getItem("userName") || "Patient";
        }
    }
}



function setupPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }
}

function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

function setupScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');

    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn?.classList.add('show');
        } else {
            scrollTopBtn?.classList.remove('show');
        }
    });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-up, .slide-in-left, .slide-in-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
}



function setupCursorEffects() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if(!dot || !outline) return;

    window.addEventListener('mousemove', e => {
        const posX = e.clientX;
        const posY = e.clientY;
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    document.querySelectorAll('a, button, .medical-system-card, .logo-container').forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
}

function initParticleBg() {
    const container = document.querySelector('.particles-bg');
    if (!container) return;
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'twinkle-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${star.style.width};
            background: rgba(255, 255, 255, ${Math.random() * 0.8});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 5 + 3}s infinite alternate;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(star);
    }
}
if (!document.querySelector('style#twinkle-animation')) {
    const style = document.createElement('style');
    style.id = 'twinkle-animation';
    style.innerHTML = `@keyframes twinkle { to { opacity: 0.2; transform: scale(0.8); } }`;
    document.head.appendChild(style);
}

function setup3DTilt() {
    const tiltElements = document.querySelectorAll('.problem-card, .feature-item, .medical-system-card, .patient-card-detail');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y - height / 2) / 15;
            const rotateY = (width / 2 - x) / 15;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}


function setupLoginForms() {
    const patientForm = document.getElementById('patientLoginForm');
    const doctorForm = document.getElementById('doctorLoginForm');

    patientForm?.addEventListener('submit', (e) => handleLogin(e, 'patient'));
    doctorForm?.addEventListener('submit', (e) => handleLogin(e, 'doctor'));

    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
}

function handleLogin(e, userType) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

   
    const isPatientLogin = userType === 'patient' && email === 'patient@demo.com' && password === 'patient123';
    const isDoctorLogin = userType === 'doctor' && email === 'doctor@demo.com' && password === 'doctor123';

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating...`;

    setTimeout(() => {
        if (isPatientLogin || isDoctorLogin) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', userType);
            localStorage.setItem('userName', isPatientLogin ? 'Demo Patient' : 'Dr. Demo');
            showToast('Login Successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = userType === 'patient' ? 'choose-system.html' : 'doctor-dashboard.html';
            }, 1500);
        } else {
            showToast('Invalid credentials!', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Login to Dashboard';
        }
    }, 1000);
}

function checkAuth(requiredType, redirectUrl) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn || userType !== requiredType) {
        window.location.href = redirectUrl;
    }
}

function selectSystem(system) {
    localStorage.setItem('selectedSystem', system);
    showToast(`Loading ${system.charAt(0).toUpperCase() + system.slice(1)} Dashboard...`, 'success');
    setTimeout(() => {
        window.location.href = `${system}-dashboard.html`;
    }, 1000);
}

function logout() {
    localStorage.clear();
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}


function setupDashboardFunctionality() {
    const userType = localStorage.getItem('userType');
    checkAuth(userType, `${userType}-login.html`);

    
    const userName = localStorage.getItem('userName') || 'User';
    document.querySelectorAll('#userName, #dashboardUserName').forEach(el => el.textContent = userName);
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('collapsed'));
    mobileMenuBtn?.addEventListener('click', () => sidebar?.classList.toggle('active'));

   
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(`section-${sectionId}`)?.classList.add('active');

            if (pageTitle) pageTitle.textContent = item.querySelector('span').textContent;

            if (window.innerWidth < 992) sidebar?.classList.remove('active');
        });
    });

    
    animateCounters();
    initCharts();
}


function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span id="toastMessage"></span>`;
        document.body.appendChild(toast);
        toast.classList.add('toast-styles'); 
    }
    const icon = toast.querySelector('i');
    toast.querySelector('#toastMessage').textContent = message;

    toast.className = 'toast'; 
    toast.classList.add(type); 
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const animate = (el, target) => {
        let start = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));
        const timer = setInterval(() => {
            start += 1;
            el.textContent = start;
            if (start === target) clearInterval(timer);
        }, stepTime);
    };
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    animate(counter, parseInt(counter.dataset.target));
                    obs.unobserve(counter);
                }
            });
        }, { threshold: 0.7 });
        observer.observe(counter);
    });
}

function initCharts() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = '#a0a0a0';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

    const createLineChart = (ctx, labels, data, color) => new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ data, borderColor: color, backgroundColor: `${color}33`, tension: 0.4, fill: true, borderWidth: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
    });

    const heartRateCtx = document.getElementById('heartRateChart');
    if (heartRateCtx) createLineChart(heartRateCtx, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [68, 72, 70, 75, 71, 69, 72], '#007BFF');

    const responseCtx = document.getElementById('responseChart');
    if (responseCtx) createLineChart(responseCtx, ['W1', 'W2', 'W3', 'W4'], [8, 6, 4, 3], '#9B59B6');

    const doshaCtx = document.getElementById('doshaChart');
    if (doshaCtx) new Chart(doshaCtx, {
        type: 'doughnut',
        data: { labels: ['Vata', 'Pitta', 'Kapha'], datasets: [{ data: [35, 40, 25], backgroundColor: ['#87CEEB', '#FF6347', '#90EE90'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 20 } } } }
    });
}


window.selectSystem = selectSystem;
window.logout = logout;


window.imageLoaded = function() {
  const skeleton = document.getElementById('teamSkeleton');
  const image = document.getElementById('teamImage');
  if (skeleton && image) {
    skeleton.style.display = 'none';
    image.classList.add('loaded');
  }
}
