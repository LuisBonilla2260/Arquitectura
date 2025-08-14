// Utilidades para el Sistema de Gestión Académica

// Función para mostrar notificaciones toast
function showToast(message, type = 'info', duration = 3000) {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Agregar estilos
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(toast);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

// Función para confirmar acciones
function confirmAction(message, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 class="modal-title">⚠️ Confirmar Acción</h3>
            </div>
            <div style="padding: 1rem 0;">
                <p>${message}</p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-warning" onclick="this.closest('.modal').remove()">❌ Cancelar</button>
                <button class="btn btn-danger" onclick="confirmAndClose()">✅ Confirmar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    function confirmAndClose() {
        modal.remove();
        if (callback) callback();
    }
}

// Función para validar formularios
function validateForm(form) {
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

// Función para formatear fechas
function formatDate(date, format = 'es-ES') {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    
    return d.toLocaleDateString(format, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para formatear números
function formatNumber(number, decimals = 0) {
    if (isNaN(number)) return '0';
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

// Función para generar IDs únicos
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para debounce
function debounce(func, wait) {
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

// Función para throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Función para copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Texto copiado al portapapeles', 'success');
    } catch (err) {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Texto copiado al portapapeles', 'success');
    }
}

// Función para exportar tabla a CSV
function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            // Obtener texto limpio sin botones de acción
            let text = cols[j].textContent || cols[j].innerText;
            if (text.includes('Editar') || text.includes('Eliminar')) continue;
            
            // Escapar comillas
            text = text.replace(/"/g, '""');
            row.push('"' + text + '"');
        }
        
        if (row.length > 0) csv.push(row.join(','));
    }
    
    // Descargar archivo
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Función para imprimir página
function printPage() {
    window.print();
}

// Función para cambiar tema (claro/oscuro)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showToast(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info');
}

// Función para inicializar tema
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        input.nextElementSibling.textContent = '👁️';
    } else {
        input.type = 'password';
        input.nextElementSibling.textContent = '🙈';
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar documento (solo números)
function isValidDocument(document) {
    return /^\d+$/.test(document) && document.length >= 8;
}

// Función para mostrar loading
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const loading = document.createElement('div');
    loading.className = 'loading-spinner';
    loading.innerHTML = `
        <div class="spinner"></div>
        <p>Cargando...</p>
    `;
    
    container.appendChild(loading);
}

// Función para ocultar loading
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const loading = container.querySelector('.loading-spinner');
    if (loading) {
        loading.remove();
    }
}

// Función para hacer scroll suave
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para obtener parámetros de URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Función para establecer parámetros de URL
function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Inicializar utilidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    // Agregar estilos CSS para las utilidades
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            font-family: inherit;
        }
        
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            color: #667eea;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        [data-theme="dark"] {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
        }
        
        [data-theme="light"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f5;
            --text-primary: #333333;
            --text-secondary: #666666;
        }
    `;
    
    document.head.appendChild(style);
});

// Exportar funciones para uso global
window.Utils = {
    showToast,
    confirmAction,
    validateForm,
    formatDate,
    formatNumber,
    generateId,
    debounce,
    throttle,
    copyToClipboard,
    exportTableToCSV,
    printPage,
    toggleTheme,
    togglePasswordVisibility,
    isValidEmail,
    isValidDocument,
    showLoading,
    hideLoading,
    smoothScrollTo,
    getUrlParameter,
    setUrlParameter
};
