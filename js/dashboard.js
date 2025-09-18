// Global variables
let currentUser = null;
let sidebarOpen = false;

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication();
  initializeUser();
  setupSidebar();
  initializeCharts();
  loadDefaultContent();
});

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }
}

function initializeUser() {
  const userType = localStorage.getItem("userType");
  const username = localStorage.getItem("username");

  currentUser = {
    type: userType,
    username: username,
    displayName: getDisplayName(userType, username),
  };

  // Update UI with user info
  document.getElementById("userDisplayName").textContent =
    currentUser.displayName;
  document.getElementById("userRole").textContent =
    getRoleDisplayName(userType);
  document.getElementById("headerUserName").textContent =
    currentUser.displayName;
}

function getDisplayName(userType, username) {
  const displayNames = {
    padre: "Padre de Familia",
    docente: "Profesor",
    secretaria: "Secretaria",
    administrador: "Administrador",
  };
  return displayNames[userType] || username;
}

function getRoleDisplayName(userType) {
  const roleNames = {
    padre: "Padre de Familia",
    docente: "Profesor",
    secretaria: "Secretaria",
    administrador: "Administrador del Sistema",
  };
  return roleNames[userType] || userType;
}

function setupSidebar() {
  const sidebarNav = document.getElementById("sidebarNav");
  const menuItems = getMenuItemsForRole(currentUser.type);

  sidebarNav.innerHTML = menuItems
    .map(
      (item) => `
        <a href="#" onclick="loadContent('${item.id}')" class="sidebar-item" data-section="${item.id}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
        </a>
    `
    )
    .join("");

  // Set first item as active
  if (menuItems.length > 0) {
    document
      .querySelector(`[data-section="${menuItems[0].id}"]`)
      .classList.add("active");
  }
}

function getMenuItemsForRole(userType) {
  const menus = {
    secretaria: [
      { id: "inicio", label: "Inicio", icon: "fas fa-home" },
      {
        id: "asistencias",
        label: "Asistencias",
        icon: "fas fa-calendar-check",
      },
      { id: "pagos", label: "Gestión de Pagos", icon: "fas fa-credit-card" },
      {
        id: "estudiantes",
        label: "Información Estudiantes",
        icon: "fas fa-users",
      },
      {
        id: "matriculas",
        label: "Gestión de Matrícula",
        icon: "fas fa-user-plus",
      },
    ],
    docente: [
      { id: "inicio", label: "Inicio", icon: "fas fa-home" },
      {
        id: "asistencias",
        label: "Asistencias",
        icon: "fas fa-calendar-check",
      },
      { id: "estudiantes", label: "Mis Estudiantes", icon: "fas fa-users" },
      { id: "documentos", label: "Documentos", icon: "fas fa-folder" },
      { id: "carpetas", label: "Crear Carpetas", icon: "fas fa-folder-plus" },
    ],
    padre: [
      { id: "inicio", label: "Inicio", icon: "fas fa-home" },
      { id: "notas", label: "Notas", icon: "fas fa-graduation-cap" },
      { id: "pagos", label: "Pagos", icon: "fas fa-credit-card" },
      {
        id: "asistencias",
        label: "Asistencias",
        icon: "fas fa-calendar-check",
      },
      { id: "matricula", label: "Matrícula", icon: "fas fa-user-plus" },
    ],
    administrador: [
      { id: "inicio", label: "Inicio", icon: "fas fa-home" },
      { id: "roles", label: "Gestión de Roles", icon: "fas fa-users-cog" },
      {
        id: "nomina",
        label: "Gestión de Nómina",
        icon: "fas fa-money-bill-wave",
      },
      { id: "pagos", label: "Pagos", icon: "fas fa-credit-card" },
      { id: "estudiantes", label: "Estudiantes", icon: "fas fa-users" },
      { id: "reportes", label: "Reportes", icon: "fas fa-chart-bar" },
      { id: "configuracion", label: "Configuración", icon: "fas fa-cog" },
    ],
  };

  return menus[userType] || [];
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  sidebarOpen = !sidebarOpen;

  if (sidebarOpen) {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  } else {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function loadContent(sectionId) {
  const pageRoutes = {
    roles:
      currentUser.type === "administrador"
        ? "/pages/administrador/gestion-usuarios.html"
        : null,
    nomina:
      currentUser.type === "administrador"
        ? "/pages/administrador/gestion-nomina.html"
        : null,

    pagos:
      currentUser.type === "secretaria" || currentUser.type === "administrador"
        ? "/pages/secretaria/gestion-pagos.html"
        : null,
    matriculas:
      currentUser.type === "secretaria" || currentUser.type === "administrador"
        ? "/pages/secretaria/matriculas.html"
        : null,

    // Profesor routes
    notas: currentUser.type === "docente" ? "/pages/profesor/notas.html" : null,

    // General routes
    "asistencia-qr": "/pages/general/asistencia-qr.html",
  };

  // Update active menu item
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
  const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  // Check if user has permission to access this section
  if (!hasPermissionForSection(sectionId, currentUser.type)) {
    showAccessDeniedMessage();
    return;
  }

  if (pageRoutes[sectionId]) {
    window.location.href = pageRoutes[sectionId];
    return;
  }

  // Handle inline content for specific roles and sections
  if (
    currentUser.type === "padre" &&
    (sectionId === "notas" || sectionId === "pagos")
  ) {
    // For padre, show content inline instead of redirecting
    const menuItem = getMenuItemsForRole(currentUser.type).find(
      (item) => item.id === sectionId
    );
    document.getElementById("pageTitle").textContent = menuItem
      ? menuItem.label
      : "Dashboard";

    const contentArea = document.getElementById("contentArea");
    contentArea.innerHTML = getContentForSection(sectionId, currentUser.type);

    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
    return;
  }

  // Update page title
  const menuItem = getMenuItemsForRole(currentUser.type).find(
    (item) => item.id === sectionId
  );
  document.getElementById("pageTitle").textContent = menuItem
    ? menuItem.label
    : "Dashboard";

  // Load content based on section and user role
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = getContentForSection(sectionId, currentUser.type);

  // Close sidebar on mobile after selection
  if (window.innerWidth < 1024) {
    toggleSidebar();
  }
}

function hasPermissionForSection(sectionId, userType) {
  const permissions = {
    padre: ["inicio", "notas", "pagos", "asistencias", "matricula"],
    secretaria: ["inicio", "asistencias", "pagos", "estudiantes", "matriculas"],
    docente: [
      "inicio",
      "asistencias",
      "estudiantes",
      "documentos",
      "carpetas",
      "notas",
    ],
    administrador: [
      "inicio",
      "roles",
      "nomina",
      "pagos",
      "estudiantes",
      "reportes",
      "configuracion",
    ],
  };

  return permissions[userType] && permissions[userType].includes(sectionId);
}

function showAccessDeniedMessage() {
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
    <div class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Acceso Denegado</h2>
        <p class="text-red-600">No tienes permisos para acceder a esta sección.</p>
      </div>
    </div>
  `;
}

function getContentForSection(sectionId, userType) {
  // Content templates based on section and user role
  const content = {
    inicio: getInicioContent(userType),
    asistencias: getAsistenciasContent(userType),
    pagos: getPagosContent(userType),
    estudiantes: getEstudiantesContent(userType),
    matriculas: getMatriculasContent(userType),
    matricula: getMatriculaContent(userType),
    notas: getNotasContent(userType),
    documentos: getDocumentosContent(userType),
    carpetas: getCarpetasContent(userType),
    roles: getRolesContent(userType),
    nomina: getNominaContent(userType),
    reportes: getReportesContent(userType),
    configuracion: getConfiguracionContent(userType),
  };

  return (
    content[sectionId] ||
    '<div class="p-6"><h2 class="text-xl font-semibold text-primary">Sección en desarrollo</h2></div>'
  );
}

function getInicioContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Bienvenido al Sistema</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <h3 class="text-lg font-semibold mb-2">Accesos Rápidos</h3>
                    <p class="text-blue-100">Navega fácilmente por las funciones principales</p>
                </div>
                <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                    <h3 class="text-lg font-semibold mb-2">Notificaciones</h3>
                    <p class="text-green-100">3 notificaciones pendientes</p>
                </div>
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <h3 class="text-lg font-semibold mb-2">Actividad Reciente</h3>
                    <p class="text-purple-100">Últimas acciones realizadas</p>
                </div>
            </div>
        </div>
    `;
}

function getAsistenciasContent(userType) {
  if (userType === "padre") {
    return `
            <div class="p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Asistencias de mi Hijo</h2>
                <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-neutral-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Hora Entrada</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-200">
                                <tr><td class="px-6 py-4">2024-01-15</td><td class="px-6 py-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Presente</span></td><td class="px-6 py-4">07:45</td><td class="px-6 py-4">-</td></tr>
                                <tr><td class="px-6 py-4">2024-01-14</td><td class="px-6 py-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Presente</span></td><td class="px-6 py-4">07:50</td><td class="px-6 py-4">-</td></tr>
                                <tr><td class="px-6 py-4">2024-01-13</td><td class="px-6 py-4"><span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Ausente</span></td><td class="px-6 py-4">-</td><td class="px-6 py-4">Enfermedad</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
  } else {
    return `
            <div class="p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Asistencias</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg border border-neutral-200 p-6">
                        <h3 class="text-lg font-semibold text-primary mb-4">Registrar Asistencia</h3>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-neutral-700 mb-2">Fecha</label>
                                <input type="date" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-neutral-700 mb-2">Grado/Sección</label>
                                <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                    <option>1° Primaria A</option>
                                    <option>2° Primaria A</option>
                                    <option>3° Primaria A</option>
                                </select>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                                Cargar Lista de Estudiantes
                            </button>
                        </form>
                    </div>
                    <div class="bg-white rounded-lg border border-neutral-200 p-6">
                        <h3 class="text-lg font-semibold text-primary mb-4">Resumen del Día</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-neutral-600">Total Estudiantes:</span>
                                <span class="font-semibold">28</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-neutral-600">Presentes:</span>
                                <span class="font-semibold text-green-600">25</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-neutral-600">Ausentes:</span>
                                <span class="font-semibold text-red-600">3</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-neutral-600">Tardanzas:</span>
                                <span class="font-semibold text-yellow-600">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
}

function getPagosContent(userType) {
  if (userType === "padre") {
    return `
            <div class="p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Estado de Pagos</h2>
                <div class="space-y-4">
                    <div class="bg-white rounded-lg border border-neutral-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-primary">Pensión Enero 2024</h3>
                            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Pagado</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div><span class="text-neutral-600">Monto:</span> S/ 350.00</div>
                            <div><span class="text-neutral-600">Fecha de Pago:</span> 05/01/2024</div>
                            <div><span class="text-neutral-600">Método:</span> Transferencia</div>
                            <div><span class="text-neutral-600">Comprobante:</span> #001234</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-neutral-200 p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-primary">Pensión Febrero 2024</h3>
                            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Pendiente</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div><span class="text-neutral-600">Monto:</span> S/ 350.00</div>
                            <div><span class="text-neutral-600">Vencimiento:</span> 10/02/2024</div>
                        </div>
                        <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">
                            Pagar Ahora
                        </button>
                    </div>
                </div>
            </div>
        `;
  } else {
    return `
            <div class="p-6">
                <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Pagos</h2>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-green-800 mb-2">Pagos del Mes</h3>
                        <p class="text-2xl font-bold text-green-600">S/ 45,230</p>
                    </div>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-yellow-800 mb-2">Pendientes</h3>
                        <p class="text-2xl font-bold text-yellow-600">S/ 12,450</p>
                    </div>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-red-800 mb-2">Vencidos</h3>
                        <p class="text-2xl font-bold text-red-600">S/ 3,200</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200">
                    <div class="p-6 border-b border-neutral-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-primary">Lista de Pagos</h3>
                            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                Generar Reporte
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-neutral-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estudiante</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Concepto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-200">
                                <tr>
                                    <td class="px-6 py-4">Ana García López</td>
                                    <td class="px-6 py-4">Pensión Febrero</td>
                                    <td class="px-6 py-4">S/ 350.00</td>
                                    <td class="px-6 py-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Pagado</span></td>
                                    <td class="px-6 py-4">
                                        <button class="text-secondary hover:text-primary">Ver Comprobante</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
  }
}

function getEstudiantesContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Información de Estudiantes</h2>
            <div class="bg-white rounded-lg border border-neutral-200">
                <div class="p-6 border-b border-neutral-200">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 class="text-lg font-semibold text-primary">Lista de Estudiantes</h3>
                        <div class="flex gap-2">
                            <input type="text" placeholder="Buscar estudiante..." class="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                            ${
                              userType !== "padre"
                                ? '<button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Agregar Estudiante</button>'
                                : ""
                            }
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-neutral-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Grado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">DNI</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <div class="font-medium text-neutral-900">Ana García López</div>
                                            <div class="text-neutral-500 text-sm">ana.garcia@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">5° Primaria A</td>
                                <td class="px-6 py-4">12345678</td>
                                <td class="px-6 py-4">
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Activo</span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <button class="text-secondary hover:text-primary">Ver</button>
                                        ${
                                          userType !== "padre"
                                            ? '<button class="text-accent hover:text-primary">Editar</button>'
                                            : ""
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getMatriculasContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Matrícula</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Nueva Matrícula</h3>
                    <form class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-neutral-700 mb-2">Nombres</label>
                                <input type="text" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-neutral-700 mb-2">Apellidos</label>
                                <input type="text" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">DNI</label>
                            <input type="text" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Grado</label>
                            <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option>1° Primaria</option>
                                <option>2° Primaria</option>
                                <option>3° Primaria</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            Registrar Matrícula
                        </button>
                    </form>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Generar Documentos</h3>
                    <div class="space-y-3">
                        <button class="w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center">
                            <i class="fas fa-file-pdf mr-2"></i>
                            Comprobante de Matrícula
                        </button>
                        <button class="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center">
                            <i class="fas fa-file-alt mr-2"></i>
                            Ficha de Datos
                        </button>
                        <button class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                            <i class="fas fa-id-card mr-2"></i>
                            Carnet Estudiantil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Additional content functions for other sections...
function getMatriculaContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Mi Matrícula</h2>
            <div class="bg-white rounded-lg border border-neutral-200 p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Información de Matrícula</h3>
                        <div class="space-y-3">
                            <div><span class="text-neutral-600">Estudiante:</span> <span class="font-medium">Ana García López</span></div>
                            <div><span class="text-neutral-600">Grado:</span> <span class="font-medium">5° Primaria A</span></div>
                            <div><span class="text-neutral-600">Año Académico:</span> <span class="font-medium">2024</span></div>
                            <div><span class="text-neutral-600">Estado:</span> <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Activa</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Documentos</h3>
                        <div class="space-y-2">
                            <a href="#" class="flex items-center text-secondary hover:text-primary">
                                <i class="fas fa-file-pdf mr-2"></i>
                                Comprobante de Matrícula
                            </a>
                            <a href="#" class="flex items-center text-secondary hover:text-primary">
                                <i class="fas fa-file-alt mr-2"></i>
                                Ficha de Datos
                            </a>
                            <a href="#" class="flex items-center text-secondary hover:text-primary">
                                <i class="fas fa-id-card mr-2"></i>
                                Carnet Estudiantil
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getNotasContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Notas Académicas</h2>
            <div class="bg-white rounded-lg border border-neutral-200">
                <div class="p-6 border-b border-neutral-200">
                    <h3 class="text-lg font-semibold text-primary">Primer Trimestre 2024</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-neutral-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Curso</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Nota 1</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Nota 2</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Nota 3</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Promedio</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr>
                                <td class="px-6 py-4 font-medium">Matemática</td>
                                <td class="px-6 py-4">18</td>
                                <td class="px-6 py-4">16</td>
                                <td class="px-6 py-4">17</td>
                                <td class="px-6 py-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">17</span></td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-medium">Comunicación</td>
                                <td class="px-6 py-4">19</td>
                                <td class="px-6 py-4">18</td>
                                <td class="px-6 py-4">20</td>
                                <td class="px-6 py-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">19</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getDocumentosContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Documentos</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Subir Documento</h3>
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Título del Documento</label>
                            <input type="text" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Categoría</label>
                            <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option>Material de Clase</option>
                                <option>Evaluaciones</option>
                                <option>Tareas</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Archivo</label>
                            <input type="file" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            Subir Documento
                        </button>
                    </form>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Documentos Recientes</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-file-pdf text-red-500 mr-3"></i>
                                <div>
                                    <p class="font-medium">Examen Matemática</p>
                                    <p class="text-sm text-neutral-600">Subido hace 2 horas</p>
                                </div>
                            </div>
                            <button class="text-secondary hover:text-primary">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCarpetasContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Crear Carpetas</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Nueva Carpeta</h3>
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Nombre de la Carpeta</label>
                            <input type="text" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Descripción</label>
                            <textarea class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent" rows="3"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Permisos</label>
                            <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option>Solo yo</option>
                                <option>Mi clase</option>
                                <option>Todos los profesores</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            Crear Carpeta
                        </button>
                    </form>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Mis Carpetas</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                            <div class="flex items-center">
                                <i class="fas fa-folder text-yellow-500 mr-3 text-xl"></i>
                                <div>
                                    <p class="font-medium">Matemática 5° A</p>
                                    <p class="text-sm text-neutral-600">12 archivos</p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="text-secondary hover:text-primary">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRolesContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Roles</h2>
            <div class="bg-white rounded-lg border border-neutral-200">
                <div class="p-6 border-b border-neutral-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-primary">Usuarios del Sistema</h3>
                        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            Agregar Usuario
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-neutral-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Usuario</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Rol</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Último Acceso</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <div class="font-medium text-neutral-900">María González</div>
                                            <div class="text-neutral-500 text-sm">maria.gonzalez@colegio.edu</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">Secretaria</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Activo</span>
                                </td>
                                <td class="px-6 py-4">Hace 2 horas</td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <button class="text-secondary hover:text-primary">Editar</button>
                                        <button class="text-red-500 hover:text-red-700">Desactivar</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getNominaContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Gestión de Nómina</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-green-800 mb-2">Nómina Total</h3>
                    <p class="text-2xl font-bold text-green-600">S/ 85,430</p>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-blue-800 mb-2">Empleados</h3>
                    <p class="text-2xl font-bold text-blue-600">24</p>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-2">Pendientes</h3>
                    <p class="text-2xl font-bold text-yellow-600">S/ 3,200</p>
                </div>
            </div>
            <div class="bg-white rounded-lg border border-neutral-200">
                <div class="p-6 border-b border-neutral-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-primary">Nómina Enero 2024</h3>
                        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            Procesar Nómina
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-neutral-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Empleado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Cargo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Sueldo Base</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Bonificaciones</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Total</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                            <tr>
                                <td class="px-6 py-4">Prof. Juan Pérez</td>
                                <td class="px-6 py-4">Docente Primaria</td>
                                <td class="px-6 py-4">S/ 2,500</td>
                                <td class="px-6 py-4">S/ 300</td>
                                <td class="px-6 py-4 font-semibold">S/ 2,800</td>
                                <td class="px-6 py-4">
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Pagado</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getReportesContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Reportes del Sistema</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-3 rounded-full mr-4">
                            <i class="fas fa-chart-bar text-blue-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-primary">Reporte Académico</h3>
                    </div>
                    <p class="text-neutral-600 mb-4">Notas y rendimiento estudiantil</p>
                    <button class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Generar Reporte
                    </button>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-3 rounded-full mr-4">
                            <i class="fas fa-money-bill-wave text-green-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-primary">Reporte Financiero</h3>
                    </div>
                    <p class="text-neutral-600 mb-4">Ingresos y pagos del período</p>
                    <button class="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        Generar Reporte
                    </button>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <div class="flex items-center mb-4">
                        <div class="bg-purple-100 p-3 rounded-full mr-4">
                            <i class="fas fa-calendar-check text-purple-600 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-primary">Reporte Asistencias</h3>
                    </div>
                    <p class="text-neutral-600 mb-4">Asistencias y tardanzas</p>
                    <button class="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                        Generar Reporte
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getConfiguracionContent(userType) {
  return `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-primary mb-6">Configuración del Sistema</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Configuración General</h3>
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Nombre de la Institución</label>
                            <input type="text" value="CEP Mi Mundo Feliz" class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Año Académico</label>
                            <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option>2024</option>
                                <option>2025</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 mb-2">Período Actual</label>
                            <select class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option>Primer Trimestre</option>
                                <option>Segundo Trimestre</option>
                                <option>Tercer Trimestre</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                            Guardar Cambios
                        </button>
                    </form>
                </div>
                <div class="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 class="text-lg font-semibold text-primary mb-4">Configuración de Seguridad</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-neutral-700">Autenticación de dos factores</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer">
                                <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-neutral-700">Notificaciones por email</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked class="sr-only peer">
                                <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                            </label>
                        </div>
                        <button class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeCharts() {
  // Students Distribution Chart
  const studentsCtx = document.getElementById("studentsChart").getContext("2d");
  window.Chart(studentsCtx, {
    type: "doughnut",
    data: {
      labels: ["Matriculados", "En Proceso", "Retirados"],
      datasets: [
        {
          data: [1247, 89, 23],
          backgroundColor: ["#10B981", "#4A90E2", "#EF4444"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Monthly Trend Chart
  const monthlyCtx = document.getElementById("monthlyChart").getContext("2d");
  window.Chart(monthlyCtx, {
    type: "line",
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [
        {
          label: "Nuevas Matrículas",
          data: [45, 52, 38, 67, 43, 58],
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function loadDefaultContent() {
  loadContent("inicio");
}

function logout() {
  localStorage.removeItem("userType");
  localStorage.removeItem("username");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
