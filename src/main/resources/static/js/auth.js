// Sistema de Autenticación y Verificación

class AuthManager {
    constructor() {
        this.API_BASE_URL = 'http://localhost:9000';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Event listeners para formularios de autenticación
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-form="login"]')) {
                e.preventDefault();
                this.handleLogin(e.target);
            } else if (e.target.matches('[data-form="register"]')) {
                e.preventDefault();
                this.handleRegister(e.target);
            } else if (e.target.matches('#verifyForm')) {
                e.preventDefault();
                this.handleVerification(e.target);
            }
        });
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/status`, {
                credentials: 'include'
            });
            if (response.ok) {
                const user = await response.json();
                this.updateUIForAuthenticatedUser(user);
            }
        } catch (error) {
            console.log('Usuario no autenticado');
        }
    }

    updateUIForAuthenticatedUser(user) {
        const authElements = document.querySelectorAll('.auth-only');
        const guestElements = document.querySelectorAll('.guest-only');
        
        authElements.forEach(el => el.style.display = 'block');
        guestElements.forEach(el => el.style.display = 'none');
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            Utils.showToast('Por favor completa todos los campos', 'error');
            return;
        }

        try {
            Utils.showLoading('login-container');
            
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                // Verificar si la cuenta está habilitada
                if (data.user && data.user.enabled === false) {
                    Utils.showToast('Cuenta no verificada. Redirigiendo a verificación...', 'warning');
                    setTimeout(() => {
                        window.location.href = '/verify.html?email=' + encodeURIComponent(data.user.email);
                    }, 2000);
                } else {
                    Utils.showToast('¡Login exitoso! Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1000);
                }
            } else {
                const error = await response.text();
                
                // Manejar errores específicos
                if (error.includes('Account not verified')) {
                    Utils.showToast('Cuenta no verificada. Por favor verifica tu email primero.', 'warning');
                    // Redirigir a verificación si tenemos el email
                    const email = formData.get('username'); // Asumimos que puede ser email
                    if (email.includes('@')) {
                        setTimeout(() => {
                            window.location.href = '/verify.html?email=' + encodeURIComponent(email);
                        }, 2000);
                    }
                } else if (error.includes('User not found')) {
                    Utils.showToast('Usuario no encontrado. Verifica tus credenciales.', 'error');
                } else if (error.includes('Credenciales incorrectas')) {
                    Utils.showToast('Credenciales incorrectas. Intenta nuevamente.', 'error');
                } else {
                    Utils.showToast('Error en el login: ' + error, 'error');
                }
            }
        } catch (error) {
            Utils.showToast('Error de conexión: ' + error.message, 'error');
        } finally {
            Utils.hideLoading('login-container');
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validaciones
        if (!username || !email || !password || !confirmPassword) {
            Utils.showToast('Por favor completa todos los campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            Utils.showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Utils.showToast('Por favor ingresa un email válido', 'error');
            return;
        }

        try {
            Utils.showLoading('register-container');
            
            const response = await fetch(`${this.API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                Utils.showToast('¡Registro exitoso! Verifica tu email.', 'success');
                setTimeout(() => {
                    window.location.href = '/verify.html?email=' + encodeURIComponent(email);
                }, 2000);
            } else {
                const error = await response.text();
                Utils.showToast('Error en el registro: ' + error, 'error');
            }
        } catch (error) {
            Utils.showToast('Error de conexión: ' + error.message, 'error');
        } finally {
            Utils.hideLoading('register-container');
        }
    }

    async handleVerification(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const verificationCode = formData.get('verificationCode');

        if (!email || !verificationCode) {
            Utils.showToast('Por favor completa todos los campos', 'error');
            return;
        }

        if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
            Utils.showToast('El código debe tener exactamente 6 dígitos numéricos', 'error');
            return;
        }

        try {
            Utils.showLoading('verify-container');
            
            const response = await fetch(`${this.API_BASE_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    verificationCode: verificationCode
                }),
                credentials: 'include'
            });

            if (response.ok) {
                Utils.showToast('¡Cuenta verificada exitosamente! Redirigiendo al login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html?verified=true';
                }, 2000);
            } else {
                const error = await response.text();
                Utils.showToast('Error: ' + error, 'error');
            }
        } catch (error) {
            Utils.showToast('Error de conexión: ' + error.message, 'error');
        } finally {
            Utils.hideLoading('verify-container');
        }
    }

    async resendVerificationCode(email) {
        if (!email) {
            Utils.showToast('Por favor ingresa tu email primero', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/resend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}`,
                credentials: 'include'
            });

            if (response.ok) {
                Utils.showToast('Código reenviado exitosamente. Revisa tu email.', 'success');
            } else {
                const error = await response.text();
                Utils.showToast('Error: ' + error, 'error');
            }
        } catch (error) {
            Utils.showToast('Error de conexión: ' + error.message, 'error');
        }
    }

    async logout() {
        try {
            await fetch(`${this.API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Error en logout:', error);
            window.location.href = '/login.html';
        }
    }

    // Función para mostrar mensaje de cuenta verificada
    showVerifiedMessage() {
        const verifiedMessage = document.getElementById('verifiedMessage');
        if (verifiedMessage) {
            verifiedMessage.style.display = 'block';
        }
    }

    // Función para validar formularios
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#f44336';
                input.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
                isValid = false;
            } else {
                input.style.borderColor = '#e1e5e9';
                input.style.boxShadow = 'none';
            }
        });
        
        return isValid;
    }
}

// Inicializar el sistema de autenticación
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Verificar si la cuenta fue verificada (para la página de login)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
        window.authManager.showVerifiedMessage();
    }
    
    // Obtener email de la URL para la página de verificación
    const email = urlParams.get('email');
    if (email && document.getElementById('email')) {
        document.getElementById('email').value = email;
    }
});

// Funciones globales para uso en HTML
function resendCode() {
    const email = document.getElementById('email')?.value;
    if (window.authManager) {
        window.authManager.resendVerificationCode(email);
    }
}

function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}
