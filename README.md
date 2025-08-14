# 🎓 Sistema de Gestión Académica - CorhuilaBD

## 📋 Descripción

Sistema completo de gestión académica desarrollado en **Spring Boot** con interfaz visual en **HTML, CSS y JavaScript**. Permite la gestión integral de estudiantes, programas académicos y usuarios del sistema.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con verificación por email
- **Login seguro** con Spring Security
- **Verificación de cuentas** mediante códigos de 6 dígitos
- **Control de acceso** basado en roles

### 👥 Gestión de Estudiantes
- **CRUD completo** de estudiantes
- **Estados académicos**: Activo (A), Inactivo (I), Egresado (E)
- **Búsquedas avanzadas** por estado, programa y documento
- **Filtros dinámicos** con estadísticas en tiempo real
- **Asignación de programas** académicos

### 📚 Gestión de Programas
- **CRUD completo** de programas académicos
- **Configuración de facultades** predefinidas
- **Estructura de semestres** (6, 8, 10 semestres)
- **Sistema de créditos** automático
- **Filtros por facultad** y duración

### 🎨 Interfaz de Usuario
- **Diseño moderno y responsivo** con CSS3
- **Navegación intuitiva** entre secciones
- **Modales interactivos** para formularios
- **Tablas dinámicas** con paginación
- **Estadísticas visuales** en tiempo real

## 🚀 Tecnologías Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **Hibernate**

### Frontend
- **HTML5**
- **CSS3** (con gradientes y efectos modernos)
- **JavaScript ES6+**
- **Responsive Design**

### Herramientas
- **Maven** para gestión de dependencias
- **Spring Boot DevTools** para desarrollo
- **SpringDoc OpenAPI** para documentación
- **Spring Boot Actuator** para monitoreo

## 📦 Requisitos del Sistema

### Software Requerido
- **Java JDK 17** o superior
- **MySQL 8.0** o superior
- **Maven 3.6** o superior
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

### Configuración Mínima
- **RAM**: 2GB
- **Almacenamiento**: 1GB libre
- **Procesador**: Dual Core 2.0 GHz

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd Backend
```

### 2. Configurar Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE proyecto_analisis;
USE proyecto_analisis;
```

### 3. Configurar Variables de Entorno
Editar `src/main/resources/application.properties`:
```properties
# Configuración de base de datos
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/proyecto_analisis
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password

# Configuración de email (Gmail)
spring.mail.username=tu_email@gmail.com
spring.mail.password=tu_app_password
```

### 4. Compilar y Ejecutar
```bash
# Compilar con Maven
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

### 5. Acceder al Sistema
- **URL Principal**: http://localhost:9000
- **Dashboard**: http://localhost:9000/dashboard.html
- **API Docs**: http://localhost:9000/swagger-ui.html

## 📱 Uso del Sistema

### 🔐 Primer Acceso
1. **Registrarse** en `/register.html`
2. **Verificar cuenta** con el código enviado por email
3. **Iniciar sesión** en `/login.html`
4. **Acceder al dashboard** principal

### 👥 Gestión de Estudiantes
1. **Navegar** a `/estudiantes.html`
2. **Crear estudiante** con el botón "➕ Nuevo Estudiante"
3. **Completar formulario** con datos requeridos
4. **Filtrar y buscar** usando los controles disponibles
5. **Editar o eliminar** estudiantes existentes

### 📚 Gestión de Programas
1. **Navegar** a `/programas.html`
2. **Crear programa** con el botón "➕ Nuevo Programa"
3. **Seleccionar facultad** y configurar semestres
4. **Definir créditos** automáticamente según duración
5. **Gestionar programas** existentes

## 🔧 Configuración Avanzada

### Personalización de Estilos
Los estilos se encuentran en `src/main/resources/static/css/styles.css`:
- **Colores principales**: Variables CSS personalizables
- **Responsive design**: Breakpoints para móviles y tablets
- **Animaciones**: Transiciones y efectos visuales

### Configuración de Seguridad
Archivo: `src/main/resources/java/.../SecurityConfiguration.java`
- **Rutas públicas**: Configurar acceso sin autenticación
- **CORS**: Configurar orígenes permitidos
- **Roles**: Definir nuevos roles de usuario

### Configuración de Email
Archivo: `src/main/resources/application.properties`
- **SMTP**: Configurar servidor de correo
- **Plantillas**: Personalizar mensajes de verificación
- **Seguridad**: Configurar autenticación SMTP

## 📊 Estructura del Proyecto

```
Backend/
├── src/main/
│   ├── java/com/corhuilabd/corhuilabd/
│   │   ├── controllers/          # Controladores REST y Web
│   │   ├── models/              # Entidades JPA
│   │   ├── repositories/        # Interfaces de repositorio
│   │   ├── services/            # Lógica de negocio
│   │   └── Security/            # Configuración de seguridad
│   └── resources/
│       ├── static/              # Archivos estáticos (HTML, CSS, JS)
│       └── application.properties
├── pom.xml                      # Dependencias Maven
└── README.md                    # Este archivo
```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar servicio MySQL
sudo systemctl status mysql

# Verificar credenciales en application.properties
# Asegurar que la base de datos existe
```

### Error de Email
```bash
# Verificar configuración SMTP en application.properties
# Usar App Password de Gmail (no contraseña normal)
# Verificar puerto 587 y TLS habilitado
```

### Error de Compilación
```bash
# Limpiar y reinstalar dependencias
mvn clean install -U

# Verificar versión de Java (JDK 17+)
java -version
```

## 🔒 Seguridad

### Características de Seguridad
- **Autenticación** basada en Spring Security
- **Verificación de email** obligatoria
- **Encriptación de contraseñas** con BCrypt
- **Control de sesiones** configurable
- **CORS** configurado para desarrollo

### Recomendaciones de Producción
- **Cambiar puerto** por defecto (9000)
- **Configurar HTTPS** con certificados SSL
- **Implementar rate limiting** para APIs
- **Auditoría de logs** de seguridad
- **Backup regular** de base de datos

## 📈 Monitoreo y Mantenimiento

### Actuator Endpoints
- **Health Check**: `/actuator/health`
- **Métricas**: `/actuator/metrics`
- **Info**: `/actuator/info`

### Logs del Sistema
```bash
# Ver logs en tiempo real
tail -f logs/spring-boot.log

# Buscar errores específicos
grep "ERROR" logs/spring-boot.log
```

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** del repositorio
2. **Crear rama** para nueva funcionalidad
3. **Implementar cambios** siguiendo estándares
4. **Crear Pull Request** con descripción detallada

### Estándares de Código
- **Java**: Seguir convenciones de Spring Boot
- **HTML**: Usar HTML5 semántico
- **CSS**: Seguir metodología BEM
- **JavaScript**: Usar ES6+ y async/await

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

### Contacto
- **Email**: bonilladelgadoi@gmail.com
- **Issues**: Crear issue en GitHub
- **Documentación**: `/swagger-ui.html`

### Recursos Adicionales
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Security**: https://spring.io/projects/spring-security
- **MySQL Docs**: https://dev.mysql.com/doc/

---

**Desarrollado con ❤️ para la gestión académica eficiente**
"# Arquitectura" 
