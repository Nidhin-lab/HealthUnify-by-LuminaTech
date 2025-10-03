document.addEventListener('DOMContentLoaded', () => {
    initCommon();

    if (document.querySelector('.hero-section')) {
        initLandingPage();
    }
    if (document.getElementById('patientLoginForm')) {
        initLoginPage('patient');
    }
    if (document.getElementById('doctorLoginForm')) {
        initLoginPage('doctor');
    }
    if (document.querySelector('.choose-system-page')) {
        initChooseSystemPage();
    }
    if (document.body.classList.contains('dashboard-body')) {
        initDashboardPage();
    }
});

function initCommon() {
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;
            ripple.classList.add('ripple');

            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            this.appendChild(ripple);
        });
    });

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                    animateOnScroll.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-left, .slide-in-right, .slide-in-up, .counter').forEach(el => {
        animateOnScroll.observe(el);
    });
}


function initLandingPage() {
    const nav = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const teamImage = document.getElementById('teamImage');
    const teamSkeleton = document.getElementById('teamSkeleton');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            if(scrollTopBtn) scrollTopBtn.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            if(scrollTopBtn) scrollTopBtn.classList.remove('visible');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 75) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    navToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
        navMenu.classList.toggle('active');
    });

    if(scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for your message!', 'success');
            contactForm.reset();
        });
    }

    if (teamImage && teamSkeleton) {
        teamSkeleton.style.display = 'block';
        teamImage.onload = () => {
            teamSkeleton.style.display = 'none';
        };
        teamImage.onerror = () => {
            teamSkeleton.style.display = 'none';
        };
    }
}

function initLoginPage(type) {
    const formId = `${type}LoginForm`;
    const emailId = `${type}Email`;
    const passwordId = `${type}Password`;
    const toggleId = `toggle${type.charAt(0).toUpperCase() + type.slice(1)}Password`;

    const form = document.getElementById(formId);
    const passwordInput = document.getElementById(passwordId);
    const passwordToggle = document.getElementById(toggleId);

    const credentials = {
        patient: { email: 'patient@demo.com', pass: 'patient123', name: 'Demo Patient', redirect: 'choose-system.html' },
        doctor: { email: 'doctor@demo.com', pass: 'doctor123', name: 'Dr. Demo', redirect: 'doctor-dashboard.html' }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById(emailId).value;
        const password = passwordInput.value;
        const btnText = form.querySelector('.btn-text');
        const btnLoader = form.querySelector('.btn-loader');
        const submitBtn = form.querySelector('button[type="submit"]');

        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        setTimeout(() => {
            if (email === credentials[type].email && password === credentials[type].pass) {
                localStorage.setItem('userType', type);
                localStorage.setItem('userName', credentials[type].name);
                localStorage.setItem('isLoggedIn', 'true');
                showToast('Login Successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = credentials[type].redirect, 1500);
            } else {
                showToast('Invalid credentials! Use demo account.', 'error');
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        }, 1000);
    });

    passwordToggle.addEventListener('click', function () {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

function initChooseSystemPage() {
    authGuard('patient', 'patient-login.html');
    const patientName = localStorage.getItem('userName') || 'Patient';
    document.getElementById('patientName').textContent = patientName;
}

function initDashboardPage() {
    const userType = localStorage.getItem('userType');
    if (userType === 'doctor') {
        authGuard('doctor', 'doctor-login.html');
    } else {
        authGuard('patient', 'patient-login.html');
    }

    const userName = localStorage.getItem('userName') || 'User';
    document.querySelectorAll('#userName, #dashboardUserName').forEach(el => {
        if(el) el.textContent = userName;
    });

    if(document.getElementById('currentDate')) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    }

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            switchSection(this.dataset.section, this);
        });
    });

    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });

    if (document.getElementById('heartRateChart')) initChart('heartRateChart', 'line', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 'Heart Rate (BPM)', [68, 72, 70, 75, 71, 69, 72], '#0078D4');
    if (document.getElementById('doshaChart')) initChart('doshaChart', 'doughnut', ['Vata', 'Pitta', 'Kapha'], 'Dosha', [35, 40, 25], ['#87CEEB', '#FF6347', '#90EE90']);
    if (document.getElementById('responseChart')) initChart('responseChart', 'line', ['Week 1', 'Week 2', 'Week 3', 'Week 4'], 'Symptom Intensity', [8, 6, 4, 3], '#9B59B6');

    if (document.getElementById('sendMessage')) {
        initAIChat();
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = 'toast show';
    toast.classList.add(type);

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function authGuard(expectedType, redirectUrl) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (isLoggedIn !== 'true' || userType !== expectedType) {
        window.location.href = redirectUrl;
    }
}

function logout() {
    localStorage.clear();
    showToast('Logged out successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function selectSystem(system) {
    localStorage.setItem('selectedSystem', system);
    showToast(`Loading ${system.charAt(0).toUpperCase() + system.slice(1)} Dashboard...`, 'success');
    setTimeout(() => window.location.href = `${system}-dashboard.html`, 1000);
}

function animateCounter(counter) {
    const target = +counter.dataset.target;
    counter.innerText = '0';
    const duration = 1500;
    const increment = target / (duration / 16);

    const updateCount = () => {
        const current = +counter.innerText;
        if (current < target) {
            counter.innerText = `${Math.ceil(current + increment)}`;
            requestAnimationFrame(updateCount);
        } else {
            counter.innerText = target;
        }
    };
    requestAnimationFrame(updateCount);
}

function switchSection(sectionId, clickedItem) {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');

    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('section-' + sectionId).classList.add('active');

    const pageTitle = document.getElementById('pageTitle');
    const newTitle = clickedItem.querySelector('span').textContent;
    if(pageTitle && newTitle) pageTitle.textContent = newTitle;
}

function initChart(canvasId, type, labels, label, data, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: type === 'doughnut', position: 'bottom' } },
    };

    if (type === 'line') {
        chartOptions.scales = { y: { beginAtZero: false } };
    }

    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: type === 'line' ? colors : 'transparent',
                backgroundColor: type === 'line' ? `${colors}20` : colors,
                tension: 0.4,
                fill: type === 'line'
            }]
        },
        options: chartOptions
    });
}

function initAIChat() {
    const sendBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const addMessage = (content, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message fade-in`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'ai' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content"><p>${content}</p></div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = () => {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        setTimeout(() => {
            addMessage("I am a demo AI assistant. I'm currently processing your request about: '" + message + "'. Full functionality is not yet implemented.", 'ai');
        }, 1000);
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}
