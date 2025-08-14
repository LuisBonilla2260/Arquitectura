// Configuración de la API
const API_BASE_URL = 'http://localhost:9000';

// Clase principal de la aplicación
class App {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadPageContent();
    }

    setupEventListeners() {
        // Event listeners para navegación
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.dataset.action;
                this.handleAction(action, e.target);
            }
        });

        // Event listeners para formularios
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    }

    async checkAuthStatus() {
        try {
            // Verificar si hay una sesión activa intentando acceder a una API protegida
            const response = await fetch(`${API_BASE_URL}/api/estudiantes/status/true`, {
                credentials: 'include'
            });
            if (response.ok) {
                this.currentUser = { authenticated: true };
                this.updateUIForAuthenticatedUser();
            } else if (response.status === 401) {
                this.currentUser = null;
                this.updateUIForGuestUser();
            }
        } catch (error) {
            console.log('Usuario no autenticado');
            this.currentUser = null;
            this.updateUIForGuestUser();
        }
    }

    updateUIForAuthenticatedUser() {
        const authElements = document.querySelectorAll('.auth-only');
        const guestElements = document.querySelectorAll('.guest-only');
        
        authElements.forEach(el => el.style.display = 'block');
        guestElements.forEach(el => el.style.display = 'none');
    }

    updateUIForGuestUser() {
        const authElements = document.querySelectorAll('.auth-only');
        const guestElements = document.querySelectorAll('.guest-only');
        
        authElements.forEach(el => el.style.display = 'none');
        guestElements.forEach(el => el.style.display = 'block');
    }

    loadPageContent() {
        const currentPage = this.getCurrentPage();
        console.log('🌐 Página actual detectada:', currentPage);
        
        switch (currentPage) {
            case 'dashboard':
                console.log('📊 Cargando dashboard...');
                this.loadDashboard();
                break;
            case 'estudiantes':
                console.log('👥 Cargando estudiantes...');
                this.loadEstudiantes();
                break;
            case 'programas':
                console.log('📚 Cargando programas...');
                this.loadProgramas();
                break;
            default:
                console.log('🏠 Página no reconocida, cargando home...');
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        console.log('🔍 Path actual:', path);
        
        if (path.includes('dashboard')) {
            console.log('📍 Página detectada: dashboard');
            return 'dashboard';
        }
        if (path.includes('estudiantes')) {
            console.log('📍 Página detectada: estudiantes');
            return 'estudiantes';
        }
        if (path.includes('programas')) {
            console.log('📍 Página detectada: programas');
            return 'programas';
        }
        
        console.log('📍 Página no reconocida, retornando: home');
        return 'home';
    }

    async handleAction(action, element) {
        console.log('🔄 Acción solicitada:', action);
        console.log('🔍 Elemento:', element);
        console.log('📊 Dataset del elemento:', element.dataset);
        
        switch (action) {
            case 'logout':
                console.log('🚪 Ejecutando logout...');
                await this.logout();
                break;
            case 'edit':
                const editId = element.dataset.id;
                const editType = element.dataset.type;
                console.log('✏️ Editando elemento:', editType, 'con ID:', editId);
                console.log('🔍 Tipo de ID:', typeof editId, 'Valor:', editId);
                
                if (!editId || editId === 'undefined') {
                    console.error('❌ ID inválido para edición:', editId);
                    this.showAlert('Error: ID inválido para edición', 'error');
                    return;
                }
                
                this.openEditModal(editId, editType);
                break;
            case 'delete':
                const deleteId = element.dataset.id;
                const deleteType = element.dataset.type;
                console.log('🗑️ Eliminando elemento:', deleteType, 'con ID:', deleteId);
                this.confirmDelete(deleteId, deleteType);
                break;
            case 'view':
                const viewId = element.dataset.id;
                const viewType = element.dataset.type;
                console.log('👁️ Viendo detalles de:', viewType, 'con ID:', viewId);
                this.viewDetails(viewId, viewType);
                break;
            case 'filter':
                console.log('🔍 Aplicando filtro...');
                this.filterData(element.dataset.filter, element.value);
                break;
            default:
                console.warn('⚠️ Acción no reconocida:', action);
        }
    }

    async handleFormSubmit(form) {
        const formType = form.dataset.form;
        const formData = new FormData(form);
        
        try {
            switch (formType) {
                case 'login':
                    await this.handleLogin(formData);
                    break;
                case 'register':
                    await this.handleRegister(formData);
                    break;
                case 'estudiante':
                    await this.handleEstudianteForm(formData);
                    break;
                case 'programa':
                    await this.handleProgramaForm(formData);
                    break;
            }
        } catch (error) {
            this.showAlert('Error: ' + error.message, 'error');
        }
    }

    async handleLogin(formData) {
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.showAlert('Login exitoso!', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            this.showAlert('Error en el login: ' + error.message, 'error');
        }
    }

    async handleRegister(formData) {
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showAlert('Registro exitoso! Verifica tu email.', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Error en el registro');
            }
        } catch (error) {
            this.showAlert('Error en el registro: ' + error.message, 'error');
        }
    }

    async handleEstudianteForm(formData) {
        console.log('🔄 Procesando formulario de estudiante...');
        console.log('📊 FormData completo:', formData);
        
        // Log de todos los campos del formulario
        console.log('🔍 Campos del formulario:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value} (tipo: ${typeof value})`);
        }
        
        // Verificar el valor del campo ID directamente del DOM
        const idField = document.getElementById('estudianteId');
        console.log('🔍 Campo ID del DOM:', idField);
        if (idField) {
            console.log('🔍 Valor del campo ID del DOM:', idField.value);
            console.log('🔍 Tipo del valor del campo ID:', typeof idField.value);
            console.log('🔍 Campo ID está vacío?', idField.value === '');
            console.log('🔍 Campo ID es undefined?', idField.value === 'undefined');
        } else {
            console.error('❌ Campo estudianteId no encontrado en el DOM!');
        }
        
        // Verificar también el FormData
        console.log('🔍 FormData.get("id"):', formData.get('id'));
        console.log('🔍 FormData.get("estudianteId"):', formData.get('estudianteId'));
        
        // Verificar que el campo ID tenga un valor válido antes de continuar
        const idValue = formData.get('id');
        console.log('🔍 ID obtenido del FormData:', idValue);
        
        if (!idValue || idValue === 'undefined' || idValue === 'null' || idValue === '') {
            console.error('❌ ID inválido en el FormData:', idValue);
            
            // Intentar obtener el ID directamente del DOM
            const domIdField = document.getElementById('estudianteId');
            console.log('🔍 Campo ID del DOM:', domIdField);
            
            if (domIdField && domIdField.value && domIdField.value !== 'undefined' && domIdField.value !== '') {
                console.log('✅ Usando ID del DOM:', domIdField.value);
                // Actualizar el FormData con el ID correcto
                formData.set('id', domIdField.value);
                console.log('✅ FormData actualizado con ID:', formData.get('id'));
            } else {
                console.error('❌ No se puede obtener un ID válido del formulario');
                console.error('❌ Campo ID del DOM:', domIdField?.value);
                this.showAlert('Error: ID de estudiante inválido', 'error');
                return;
            }
        } else {
            console.log('✅ ID válido en FormData:', idValue);
        }
        
        const estudianteData = {
            nombreEstudiante: formData.get('nombre'),
            edad: parseInt(formData.get('edad')),
            documento: parseInt(formData.get('documento')),
            status: formData.get('status'),
            programaId: { id: parseInt(formData.get('programaId')) }
        };
        
        console.log('📋 Datos del estudiante a enviar:', estudianteData);
        
        const isEdit = formData.get('id');
        console.log('🔍 ID para edición del FormData:', isEdit, 'Tipo:', typeof isEdit);
        
        // Verificación final del ID antes de construir la URL
        if (isEdit && (isEdit === 'undefined' || isEdit === 'null' || isEdit === '')) {
            console.error('❌ ID inválido para edición, abortando envío');
            this.showAlert('Error: ID de estudiante inválido para edición', 'error');
            return;
        }
        
        const url = isEdit ? 
            `${API_BASE_URL}/api/estudiantes/${isEdit}` : 
            `${API_BASE_URL}/api/estudiantes`;
        const method = isEdit ? 'PUT' : 'POST';
        
        console.log('🌐 URL de la petición:', url);
        console.log('📡 Método HTTP:', method);

        try {
            console.log('📤 Enviando petición...');
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(estudianteData),
                credentials: 'include'
            });
            
            console.log('📡 Respuesta recibida:', response.status, response.statusText);

            if (response.ok) {
                console.log('✅ Petición exitosa');
                this.showAlert(
                    isEdit ? 'Estudiante actualizado exitosamente!' : 'Estudiante creado exitosamente!', 
                    'success'
                );
                this.closeModal();
                
                // Actualización dinámica inmediata
                await this.loadEstudiantes();
                
                // Si estamos en el dashboard, también actualizarlo
                if (this.getCurrentPage() === 'dashboard') {
                    await this.loadDashboard();
                }
                
                // Limpiar el formulario después de guardar
                this.resetEstudianteForm();
            } else {
                const error = await response.text();
                console.error('❌ Error en la respuesta:', error);
                throw new Error(error || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('❌ Error en handleEstudianteForm:', error);
            this.showAlert('Error: ' + error.message, 'error');
        }
    }

    async handleProgramaForm(formData) {
        console.log('🔄 Procesando formulario de programa...');
        console.log('📊 FormData completo:', formData);
        
        // Log de todos los campos del formulario
        console.log('🔍 Campos del formulario:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value} (tipo: ${typeof value})`);
        }
        
        // Verificar el valor del campo ID directamente del DOM
        const idField = document.getElementById('programaId');
        console.log('🔍 Campo ID del DOM:', idField);
        if (idField) {
            console.log('🔍 Valor del campo ID del DOM:', idField.value);
            console.log('🔍 Tipo del valor del campo ID:', typeof idField.value);
            console.log('🔍 Campo ID está vacío?', idField.value === '');
            console.log('🔍 Campo ID es undefined?', idField.value === 'undefined');
        } else {
            console.error('❌ Campo programaId no encontrado en el DOM!');
        }
        
        // Verificar también el FormData
        console.log('🔍 FormData.get("id"):', formData.get('id'));
        console.log('🔍 FormData.get("programaId"):', formData.get('programaId'));
        
        const programaData = {
            nomPrograma: formData.get('nombre'),
            facultad: formData.get('facultad'),
            numSemestre: parseInt(formData.get('semestres')),
            numCredito: parseInt(formData.get('creditos')),
            descripcion: formData.get('descripcion')
        };
        
        console.log('📋 Datos del programa a enviar:', programaData);
        
        const isEdit = formData.get('id');
        console.log('🔍 ID para edición del FormData:', isEdit, 'Tipo:', typeof isEdit);
        
        const url = isEdit ? 
            `${API_BASE_URL}/api/programas/${isEdit}` : 
            `${API_BASE_URL}/api/programas`;
        const method = isEdit ? 'PUT' : 'POST';
        
        console.log('🌐 URL de la petición:', url);
        console.log('📡 Método HTTP:', method);

        try {
            console.log('📤 Enviando petición...');
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(programaData),
                credentials: 'include'
            });
            
            console.log('📡 Respuesta recibida:', response.status, response.statusText);

            if (response.ok) {
                console.log('✅ Petición exitosa');
                this.showAlert(
                    isEdit ? 'Programa actualizado exitosamente!' : 'Programa creado exitosamente!', 
                    'success'
                );
                this.closeModal();
                
                // Actualización dinámica inmediata
                await this.loadProgramas();
                
                // Si estamos en el dashboard, también actualizarlo
                if (this.getCurrentPage() === 'dashboard') {
                    await this.loadDashboard();
                }
                
                // Limpiar el formulario después de guardar
                this.resetProgramaForm();
            } else {
                const error = await response.text();
                console.error('❌ Error en la respuesta:', error);
                throw new Error(error || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('❌ Error en handleProgramaForm:', error);
            this.showAlert('Error: ' + error.message, 'error');
        }
    }

    async loadDashboard() {
        try {
            console.log('🔄 Cargando dashboard...');
            
            const [estudiantesResponse, programasResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/api/estudiantes/status/true`, { credentials: 'include' }),
                fetch(`${API_BASE_URL}/api/programas/status/true`, { credentials: 'include' })
            ]);

            if (!estudiantesResponse.ok || !programasResponse.ok) {
                throw new Error('Error en las respuestas de la API');
            }

            const estudiantesData = await estudiantesResponse.json();
            const programasData = await programasResponse.json();
            
            console.log('📊 Datos del dashboard - Estudiantes:', estudiantesData);
            console.log('📊 Datos del dashboard - Programas:', programasData);

            // Extraer arrays de datos
            const estudiantes = this.extractDataFromResponse(estudiantesData);
            const programas = this.extractDataFromResponse(programasData);
            
            console.log('✅ Datos extraídos - Estudiantes:', estudiantes);
            console.log('✅ Datos extraídos - Programas:', programas);

            this.updateDashboardStats(estudiantes, programas);
        } catch (error) {
            console.error('❌ Error cargando dashboard:', error);
        }
    }

    updateDashboardStats(estudiantes, programas) {
        const totalEstudiantes = estudiantes.length;
        const totalProgramas = programas.length;
        const estudiantesActivos = estudiantes.filter(e => e.status === 'A').length;

        document.getElementById('total-estudiantes').textContent = totalEstudiantes;
        document.getElementById('total-programas').textContent = totalProgramas;
        document.getElementById('estudiantes-activos').textContent = estudiantesActivos;
    }

    async loadEstudiantes() {
        try {
            console.log('🔄 Cargando estudiantes...');
            
            // Mostrar indicador de carga
            this.showLoadingIndicator('estudiantes-table');
            
            const response = await fetch(`${API_BASE_URL}/api/estudiantes/status/true`, {
                credentials: 'include'
            });
            
            console.log('📡 Respuesta de la API estudiantes:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log('📊 Respuesta completa de estudiantes:', responseData);
            
            // Extraer los estudiantes del objeto de respuesta
            let estudiantes = [];
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
                estudiantes = responseData.data;
                console.log('✅ Estudiantes extraídos correctamente:', estudiantes);
            } else if (Array.isArray(responseData)) {
                estudiantes = responseData;
                console.log('✅ Estudiantes recibidos directamente como array:', estudiantes);
            } else {
                console.warn('⚠️ Formato de respuesta inesperado para estudiantes:', responseData);
                estudiantes = [];
            }
            
            this.renderEstudiantesTable(estudiantes);
        } catch (error) {
            console.error('❌ Error cargando estudiantes:', error);
            this.showAlert('Error cargando estudiantes: ' + error.message, 'error');
        } finally {
            // Ocultar indicador de carga
            this.hideLoadingIndicator('estudiantes-table');
        }
    }

    renderEstudiantesTable(estudiantes) {
        console.log('🎨 Renderizando tabla de estudiantes...');
        console.log('📋 Datos a renderizar:', estudiantes);
        
        const tbody = document.querySelector('#estudiantes-table tbody');
        console.log('🔍 Tbody encontrado:', tbody);
        
        if (!tbody) {
            console.error('❌ No se encontró el tbody de la tabla de estudiantes');
            return;
        }

        tbody.innerHTML = '';
        console.log('🧹 Tbody limpiado');
        
        if (estudiantes && estudiantes.length > 0) {
            estudiantes.forEach((estudiante, index) => {
                console.log(`📝 Creando fila ${index + 1} para estudiante:`, estudiante);
                console.log(`🔍 ID del estudiante: ${estudiante.id} (tipo: ${typeof estudiante.id})`);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${estudiante.nombreEstudiante || 'N/A'}</td>
                    <td>${estudiante.edad || 'N/A'}</td>
                    <td>${estudiante.documento || 'N/A'}</td>
                    <td><span class="status-badge status-${(estudiante.status || 'A').toLowerCase()}">${estudiante.status || 'A'}</span></td>
                    <td>${estudiante.programaId?.nomPrograma || 'N/A'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-primary" data-action="edit" data-id="${estudiante.id}" data-type="estudiante">Editar</button>
                        <button class="btn btn-danger" data-action="delete" data-id="${estudiante.id}" data-type="estudiante">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
                console.log(`✅ Fila ${index + 1} agregada con ID: ${estudiante.id}`);
            });
        } else {
            console.log('⚠️ No hay estudiantes para mostrar');
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">No hay estudiantes disponibles</td>';
            tbody.appendChild(row);
        }
        
        console.log('🎯 Tabla de estudiantes renderizada completamente');
    }

    async loadProgramas() {
        try {
            console.log('🔄 Cargando programas...');
            
            // Mostrar indicador de carga
            this.showLoadingIndicator('programas-table');
            
            const response = await fetch(`${API_BASE_URL}/api/programas/status/true`, {
                credentials: 'include'
            });
            
            console.log('📡 Respuesta de la API:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log('📊 Respuesta completa de la API:', responseData);
            
            // Extraer los programas del objeto de respuesta
            let programas = [];
            if (responseData && responseData.data && Array.isArray(responseData.data)) {
                programas = responseData.data;
                console.log('✅ Programas extraídos correctamente:', programas);
            } else if (Array.isArray(responseData)) {
                programas = responseData;
                console.log('✅ Programas recibidos directamente como array:', programas);
            } else {
                console.warn('⚠️ Formato de respuesta inesperado:', responseData);
                programas = [];
            }
            
            this.renderProgramasTable(programas);
        } catch (error) {
            console.error('❌ Error cargando programas:', error);
            this.showAlert('Error cargando programas: ' + error.message, 'error');
        } finally {
            // Ocultar indicador de carga
            this.hideLoadingIndicator('programas-table');
        }
    }

    renderProgramasTable(programas) {
        console.log('🎨 Renderizando tabla de programas...');
        console.log('📋 Datos a renderizar:', programas);
        
        const tbody = document.querySelector('#programas-table tbody');
        console.log('🔍 Tbody encontrado:', tbody);
        
        if (!tbody) {
            console.error('❌ No se encontró el tbody de la tabla de programas');
            return;
        }

        tbody.innerHTML = '';
        console.log('🧹 Tbody limpiado');
        
        if (programas && programas.length > 0) {
            programas.forEach((programa, index) => {
                console.log(`📝 Creando fila ${index + 1} para programa:`, programa);
                console.log(`🔍 ID del programa: ${programa.id} (tipo: ${typeof programa.id})`);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${programa.nomPrograma || 'N/A'}</td>
                    <td>${programa.facultad || 'N/A'}</td>
                    <td>${programa.numSemestre || 'N/A'}</td>
                    <td>${programa.numCredito || 'N/A'}</td>
                    <td>${programa.descripcion || 'N/A'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-primary" data-action="edit" data-id="${programa.id}" data-type="programa">Editar</button>
                        <button class="btn btn-danger" data-action="delete" data-id="${programa.id}" data-type="programa">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
                console.log(`✅ Fila ${index + 1} agregada con ID: ${programa.id}`);
            });
        } else {
            console.log('⚠️ No hay programas para mostrar');
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">No hay programas disponibles</td>';
            tbody.appendChild(row);
        }
        
        console.log('🎯 Tabla de programas renderizada completamente');
    }

    openEditModal(id, type) {
        if (type === 'programa') {
            this.openEditProgramaModal(id);
        } else if (type === 'estudiante') {
            this.openEditEstudianteModal(id);
        }
    }

    async openEditProgramaModal(id) {
        try {
            console.log('🔄 Abriendo modal de edición para programa con ID:', id);
            console.log('🔍 Tipo de ID:', typeof id, 'Valor:', id);
            
            // Validar que el ID sea válido
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('ID de programa inválido: ' + id);
            }
            
            const url = `${API_BASE_URL}/api/programas/${id}`;
            console.log('📡 URL de la petición:', url);
            
            const response = await fetch(url, {
                credentials: 'include'
            });
            
            console.log('📡 Respuesta de la API:', response.status, response.statusText);
            
            if (response.ok) {
                const programa = await response.json();
                console.log('📊 Programa recibido:', programa);
                
                // Llenar el formulario con los datos del programa
                const programaIdField = document.getElementById('programaId');
                const nombreField = document.getElementById('nombrePrograma');
                const facultadField = document.getElementById('facultadPrograma');
                const semestresField = document.getElementById('semestresPrograma');
                const creditosField = document.getElementById('creditosPrograma');
                const descripcionField = document.getElementById('descripcionPrograma');
                
                console.log('🔍 Campos del formulario encontrados:');
                console.log('  - programaIdField:', programaIdField);
                console.log('  - nombreField:', nombreField);
                console.log('  - facultadField:', facultadField);
                console.log('  - semestresField:', semestresField);
                console.log('  - creditosField:', creditosField);
                console.log('  - descripcionField:', descripcionField);
                
                if (programaIdField) {
                    programaIdField.value = programa.id;
                    console.log('✅ Campo ID llenado con valor:', programa.id);
                    console.log('🔍 Valor del campo ID después de llenar:', programaIdField.value);
                    console.log('🔍 Campo ID está vacío después de llenar?', programaIdField.value === '');
                    console.log('🔍 Campo ID es undefined después de llenar?', programaIdField.value === 'undefined');
                    
                    // Verificar que el campo se haya llenado correctamente
                    setTimeout(() => {
                        console.log('🔍 Verificación tardía del campo ID:', programaIdField.value);
                    }, 100);
                } else {
                    console.error('❌ Campo programaId no encontrado!');
                }
                
                if (nombreField) nombreField.value = programa.nomPrograma || '';
                if (facultadField) facultadField.value = programa.facultad || '';
                if (semestresField) semestresField.value = programa.numSemestre || '';
                if (creditosField) creditosField.value = programa.numCredito || '';
                if (descripcionField) descripcionField.value = programa.descripcion || '';
                
                console.log('✅ Formulario llenado con datos del programa');
                
                // Cambiar el título del modal
                const titleElement = document.getElementById('programaModalTitle');
                if (titleElement) {
                    titleElement.textContent = '✏️ Editar Programa';
                    console.log('✅ Título del modal actualizado');
                } else {
                    console.error('❌ Título del modal no encontrado');
                }
                
                // Mostrar el modal
                console.log('🎯 Mostrando modal de edición...');
                showModal('programaModal');
                console.log('✅ Modal de edición mostrado exitosamente');
            } else {
                const errorText = await response.text();
                console.error('❌ Error en la respuesta de la API:', errorText);
                this.showAlert('Error al cargar el programa para editar: ' + errorText, 'error');
            }
        } catch (error) {
            console.error('❌ Error en openEditProgramaModal:', error);
            this.showAlert('Error de conexión: ' + error.message, 'error');
        }
    }

    async openEditEstudianteModal(id) {
        try {
            console.log('🔄 Abriendo modal de edición para estudiante con ID:', id);
            console.log('🔍 Tipo de ID:', typeof id, 'Valor:', id);
            
            // Validar que el ID sea válido
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('ID de estudiante inválido: ' + id);
            }
            
            const url = `${API_BASE_URL}/api/estudiantes/${id}`;
            console.log('📡 URL de la petición:', url);
            
            const response = await fetch(url, {
                credentials: 'include'
            });
            
            console.log('📡 Respuesta de la API:', response.status, response.statusText);
            
            if (response.ok) {
                const estudiante = await response.json();
                console.log('📊 Estudiante recibido:', estudiante);
                console.log('🔍 Estructura completa del estudiante:', JSON.stringify(estudiante, null, 2));
                
                // Verificar que el estudiante tenga ID válido
                if (!estudiante || !estudiante.id) {
                    console.error('❌ Estudiante sin ID válido:', estudiante);
                    this.showAlert('Error: Estudiante sin ID válido', 'error');
                    return;
                }
                
                console.log('✅ ID del estudiante válido:', estudiante.id);
                
                // Cargar programas disponibles antes de llenar el formulario
                console.log('🔄 Cargando programas para el formulario...');
                await this.loadProgramasForEstudianteForm();
                
                // Llenar el formulario con los datos del estudiante
                const estudianteIdField = document.getElementById('estudianteId');
                const nombreField = document.getElementById('nombreEstudiante');
                const edadField = document.getElementById('edadEstudiante');
                const documentoField = document.getElementById('documentoEstudiante');
                const statusField = document.getElementById('statusEstudiante');
                const programaField = document.getElementById('programaEstudiante');
                
                console.log('🔍 Campos del formulario encontrados:');
                console.log('  - estudianteIdField:', estudianteIdField);
                console.log('  - nombreField:', nombreField);
                console.log('  - edadField:', edadField);
                console.log('  - documentoField:', documentoField);
                console.log('  - statusField:', statusField);
                console.log('  - programaField:', programaField);
                
                if (estudianteIdField) {
                    console.log('🔍 Antes de llenar - Campo ID encontrado:', estudianteIdField);
                    console.log('🔍 Antes de llenar - Valor actual del campo ID:', estudianteIdField.value);
                    
                    // Limpiar el campo ID antes de llenarlo
                    estudianteIdField.value = '';
                    estudianteIdField.removeAttribute('value');
                    
                    // Llenar el campo ID con el ID real del estudiante
                    estudianteIdField.value = estudiante.id;
                    
                    // Verificar que el campo se haya llenado correctamente
                    if (estudianteIdField.value === estudiante.id) {
                        console.log('✅ Campo ID llenado correctamente con valor:', estudiante.id);
                    } else {
                        console.error('❌ Campo ID no se llenó correctamente');
                        // Intentar llenar nuevamente
                        estudianteIdField.value = estudiante.id;
                        console.log('🔄 Campo ID rellenado:', estudianteIdField.value);
                    }
                    
                    console.log('🔍 Valor del campo ID después de llenar:', estudianteIdField.value);
                    console.log('🔍 Campo ID está vacío después de llenar?', estudianteIdField.value === '');
                    console.log('🔍 Campo ID es undefined después de llenar?', estudianteIdField.value === 'undefined');
                    
                    // Verificar que el campo se haya llenado correctamente
                    setTimeout(() => {
                        console.log('🔍 Verificación tardía del campo ID:', estudianteIdField.value);
                        console.log('🔍 Verificación tardía - Campo ID está vacío?', estudianteIdField.value === '');
                        console.log('🔍 Verificación tardía - Campo ID es undefined?', estudianteIdField.value === 'undefined');
                        
                        // Si el campo no tiene el valor correcto, llenarlo nuevamente
                        if (estudianteIdField.value !== estudiante.id) {
                            console.warn('⚠️ Campo ID perdió su valor, rellenando...');
                            estudianteIdField.value = estudiante.id;
                            console.log('✅ Campo ID rellenado nuevamente:', estudianteIdField.value);
                        }
                    }, 100);
                } else {
                    console.error('❌ Campo estudianteId no encontrado!');
                    console.error('❌ Verificando si existe con otros selectores...');
                    
                    // Intentar encontrar el campo con diferentes selectores
                    const alternativeIdField = document.querySelector('input[name="id"]');
                    console.log('🔍 Campo alternativo encontrado:', alternativeIdField);
                    
                    if (alternativeIdField) {
                        console.log('✅ Usando campo alternativo para ID');
                        alternativeIdField.value = estudiante.id;
                        console.log('✅ Campo alternativo llenado con valor:', estudiante.id);
                    }
                }
                
                if (nombreField) {
                    nombreField.value = estudiante.nombreEstudiante || '';
                    console.log('✅ Campo nombre llenado:', estudiante.nombreEstudiante);
                } else {
                    console.error('❌ Campo nombre no encontrado');
                }
                
                if (edadField) {
                    edadField.value = estudiante.edad || '';
                    console.log('✅ Campo edad llenado:', estudiante.edad);
                } else {
                    console.error('❌ Campo edad no encontrado');
                }
                
                if (documentoField) {
                    documentoField.value = estudiante.documento || '';
                    console.log('✅ Campo documento llenado:', estudiante.documento);
                } else {
                    console.error('❌ Campo documento no encontrado');
                }
                
                if (statusField) {
                    statusField.value = estudiante.status || '';
                    console.log('✅ Campo status llenado:', estudiante.status);
                } else {
                    console.error('❌ Campo status no encontrado');
                }
                
                if (programaField) {
                    programaField.value = estudiante.programaId?.id || '';
                    console.log('✅ Campo programa llenado:', estudiante.programaId?.id);
                } else {
                    console.error('❌ Campo programa no encontrado');
                }
                
                console.log('✅ Formulario llenado con datos del estudiante');
                
                // Verificación final de todos los campos
                console.log('🔍 Verificación final de campos:');
                console.log('  - ID:', document.getElementById('estudianteId')?.value);
                console.log('  - Nombre:', document.getElementById('nombreEstudiante')?.value);
                console.log('  - Edad:', document.getElementById('edadEstudiante')?.value);
                console.log('  - Documento:', document.getElementById('documentoEstudiante')?.value);
                console.log('  - Status:', document.getElementById('statusEstudiante')?.value);
                console.log('  - Programa:', document.getElementById('programaEstudiante')?.value);
                
                // Verificación adicional del campo ID
                const finalIdCheck = document.getElementById('estudianteId');
                if (finalIdCheck && finalIdCheck.value === estudiante.id) {
                    console.log('✅ Campo ID verificado correctamente:', finalIdCheck.value);
                } else {
                    console.error('❌ Campo ID no coincide con el estudiante:', {
                        campo: finalIdCheck?.value,
                        estudiante: estudiante.id
                    });
                    
                    // Intentar llenar nuevamente el campo ID
                    if (finalIdCheck) {
                        finalIdCheck.value = estudiante.id;
                        console.log('🔄 Campo ID rellenado nuevamente:', finalIdCheck.value);
                    }
                }
                
                // Cambiar el título del modal
                const titleElement = document.getElementById('estudianteModalTitle');
                if (titleElement) {
                    titleElement.textContent = '✏️ Editar Estudiante';
                }
                
                // Mostrar el modal
                console.log('🎯 Mostrando modal de edición...');
                showModal('estudianteModal');
                console.log('✅ Modal de edición mostrado exitosamente');
                
                // Verificación adicional después de mostrar el modal
                setTimeout(() => {
                    console.log('🔍 Verificación post-modal de campos:');
                    console.log('  - ID:', document.getElementById('estudianteId')?.value);
                    console.log('  - Nombre:', document.getElementById('nombreEstudiante')?.value);
                    console.log('  - Edad:', document.getElementById('edadEstudiante')?.value);
                    console.log('  - Documento:', document.getElementById('documentoEstudiante')?.value);
                    console.log('  - Status:', document.getElementById('statusEstudiante')?.value);
                    console.log('  - Programa:', document.getElementById('programaEstudiante')?.value);
                    
                    // Verificar que el campo ID esté presente y tenga valor
                    const finalIdField = document.getElementById('estudianteId');
                    if (finalIdField) {
                        console.log('✅ Campo ID final encontrado con valor:', finalIdField.value);
                        
                        // Si el campo ID no tiene el valor correcto, llenarlo nuevamente
                        if (finalIdField.value !== estudiante.id) {
                            console.warn('⚠️ Campo ID no tiene el valor correcto, rellenando...');
                            finalIdField.value = estudiante.id;
                            console.log('✅ Campo ID rellenado nuevamente:', finalIdField.value);
                        }
                    } else {
                        console.error('❌ Campo ID final NO encontrado');
                    }
                }, 200);
            } else {
                const errorText = await response.text();
                console.error('❌ Error en la respuesta de la API:', errorText);
                this.showAlert('Error al cargar el estudiante para editar: ' + errorText, 'error');
            }
        } catch (error) {
            console.error('❌ Error en openEditEstudianteModal:', error);
            this.showAlert('Error de conexión: ' + error.message, 'error');
        }
    }

    confirmDelete(id, type) {
        if (confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) {
            this.deleteItem(id, type);
        }
    }

    async deleteItem(id, type) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${type}s/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado exitosamente!`, 'success');
                
                // Actualización dinámica inmediata
                if (type === 'estudiante') {
                    await this.loadEstudiantes();
                } else if (type === 'programa') {
                    await this.loadProgramas();
                }
                
                // Si estamos en el dashboard, también actualizarlo
                if (this.getCurrentPage() === 'dashboard') {
                    await this.loadDashboard();
                }
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            this.showAlert('Error al eliminar: ' + error.message, 'error');
        }
    }

    async logout() {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Error en logout:', error);
            window.location.href = '/login.html';
        }
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    filterData(filterType, value) {
        // Implementar lógica de filtrado
        console.log(`Filtrando por ${filterType}: ${value}`);
    }

    resetProgramaForm() {
        console.log('🧹 Reseteando formulario de programa...');
        
        const form = document.getElementById('programaForm');
        const idField = document.getElementById('programaId');
        const title = document.getElementById('programaModalTitle');
        
        if (form) {
            form.reset();
            console.log('✅ Formulario reseteado');
        } else {
            console.error('❌ Formulario no encontrado');
        }
        
        if (idField) {
            idField.value = '';
            console.log('✅ Campo ID limpiado');
        } else {
            console.error('❌ Campo ID no encontrado');
        }
        
        if (title) {
            title.textContent = '➕ Nuevo Programa Académico';
            console.log('✅ Título actualizado');
        } else {
            console.error('❌ Título no encontrado');
        }
        
        console.log('🎯 Formulario de programa reseteado completamente');
    }

    resetEstudianteForm() {
        console.log('🧹 Reseteando formulario de estudiante...');
        
        const form = document.getElementById('estudianteForm');
        const idField = document.getElementById('estudianteId');
        const title = document.getElementById('estudianteModalTitle');
        
        if (form) {
            form.reset();
            console.log('✅ Formulario reseteado');
        } else {
            console.error('❌ Formulario no encontrado');
        }
        
        if (idField) {
            // Limpiar explícitamente el campo ID
            idField.value = '';
            idField.removeAttribute('value');
            console.log('✅ Campo ID limpiado completamente');
            console.log('🔍 Valor del campo ID después de limpiar:', idField.value);
        } else {
            console.error('❌ Campo ID no encontrado');
        }
        
        if (title) {
            title.textContent = '➕ Nuevo Estudiante';
            console.log('✅ Título actualizado');
        } else {
            console.error('❌ Título no encontrado');
        }
        
        // Verificación final de limpieza
        setTimeout(() => {
            const finalIdField = document.getElementById('estudianteId');
            if (finalIdField) {
                console.log('🔍 Verificación final - Campo ID limpio:', finalIdField.value);
                if (finalIdField.value === '') {
                    console.log('✅ Campo ID está correctamente limpio');
                } else {
                    console.warn('⚠️ Campo ID no está completamente limpio:', finalIdField.value);
                    // Forzar limpieza adicional
                    finalIdField.value = '';
                }
            }
        }, 100);
        
        console.log('🎯 Formulario de estudiante reseteado completamente');
    }

    // Función para abrir modal de nuevo programa/estudiante
    openNewModal(type) {
        console.log('🔄 Abriendo modal para:', type);
        
        if (type === 'programa') {
            console.log('📚 Abriendo modal de programa...');
            this.resetProgramaForm();
            showModal('programaModal');
        } else if (type === 'estudiante') {
            console.log('👥 Abriendo modal de estudiante...');
            this.resetEstudianteForm();
            // Cargar programas disponibles antes de mostrar el modal
            console.log('🔄 Cargando programas para el formulario...');
            this.loadProgramasForEstudianteForm();
            showModal('estudianteModal');
        }
    }

    // Función para cargar programas en el formulario de estudiantes
    async loadProgramasForEstudianteForm() {
        try {
            console.log('🔄 Cargando programas para formulario de estudiantes...');
            
            const response = await fetch(`${API_BASE_URL}/api/programas/status/true`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('📊 Respuesta de programas para formulario:', responseData);
                
                // Extraer programas usando la función auxiliar
                const programas = this.extractDataFromResponse(responseData);
                console.log('✅ Programas extraídos para formulario:', programas);
                
                const select = document.getElementById('programaEstudiante');
                const filterSelect = document.getElementById('filterPrograma');
                
                console.log('🔍 Elementos encontrados - Select:', select, 'Filter:', filterSelect);
                
                if (select && filterSelect) {
                    // Limpiar opciones existentes
                    select.innerHTML = '<option value="">Selecciona el programa</option>';
                    filterSelect.innerHTML = '<option value="">Todos los programas</option>';
                    
                    if (programas && programas.length > 0) {
                        programas.forEach(programa => {
                            console.log(`📝 Agregando programa: ${programa.nomPrograma} - ${programa.facultad} (ID: ${programa.id})`);
                            
                            const option = document.createElement('option');
                            option.value = programa.id;
                            option.textContent = `${programa.nomPrograma} - ${programa.facultad}`;
                            select.appendChild(option);
                            
                            const filterOption = document.createElement('option');
                            filterOption.value = programa.id;
                            filterOption.textContent = programa.nomPrograma;
                            filterSelect.appendChild(filterOption);
                        });
                        console.log(`✅ ${programas.length} programas agregados al formulario`);
                    } else {
                        console.warn('⚠️ No hay programas disponibles para el formulario');
                        select.innerHTML = '<option value="">No hay programas disponibles</option>';
                        filterSelect.innerHTML = '<option value="">No hay programas disponibles</option>';
                    }
                } else {
                    console.error('❌ No se encontraron los elementos select');
                    if (!select) console.error('❌ Select programaEstudiante no encontrado');
                    if (!filterSelect) console.error('❌ Select filterPrograma no encontrado');
                }
            } else {
                console.error('❌ Error cargando programas para el formulario:', response.status);
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
        }
    }

    // Función para mostrar indicador de carga
    showLoadingIndicator(tableId) {
        const table = document.getElementById(tableId);
        if (table) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = `${tableId}-loading`;
            loadingDiv.className = 'loading-overlay';
            loadingDiv.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Cargando...</p>
                </div>
            `;
            table.parentNode.insertBefore(loadingDiv, table);
        }
    }

    // Función para ocultar indicador de carga
    hideLoadingIndicator(tableId) {
        const loadingDiv = document.getElementById(`${tableId}-loading`);
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Función auxiliar para extraer datos de la respuesta de la API
    extractDataFromResponse(responseData) {
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
            return responseData.data;
        } else if (Array.isArray(responseData)) {
            return responseData;
        } else {
            console.warn('⚠️ Formato de respuesta inesperado:', responseData);
            return [];
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Funciones utilitarias globales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Limpiar formularios cuando se cierre el modal
        if (modalId === 'programaModal') {
            const form = document.getElementById('programaForm');
            if (form) form.reset();
            const title = document.getElementById('programaModalTitle');
            if (title) title.textContent = '➕ Nuevo Programa Académico';
            const idField = document.getElementById('programaId');
            if (idField) idField.value = '';
        } else if (modalId === 'estudianteModal') {
            const form = document.getElementById('estudianteForm');
            if (form) form.reset();
            const title = document.getElementById('estudianteModalTitle');
            if (title) title.textContent = '➕ Nuevo Estudiante';
            const idField = document.getElementById('estudianteId');
            if (idField) idField.value = '';
        }
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
}
