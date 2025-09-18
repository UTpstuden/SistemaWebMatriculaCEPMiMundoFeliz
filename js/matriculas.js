// Gestión de Matrículas - JavaScript

// Sample enrollments data
const enrollments = [
  {
    id: 1,
    studentName: "Carlos Mendoza Ruiz",
    grade: "3° Primaria A",
    applicationDate: "2024-01-10",
    status: "pendiente",
    documents: ["DNI", "Partida"],
    parentName: "María Ruiz",
    parentPhone: "987654321",
  },
  {
    id: 2,
    studentName: "Ana Sofía López",
    grade: "1° Primaria B",
    applicationDate: "2024-01-08",
    status: "aprobado",
    documents: ["DNI", "Partida", "Certificado"],
    parentName: "José López",
    parentPhone: "987654322",
  },
  {
    id: 3,
    studentName: "Diego Fernández",
    grade: "5° Primaria A",
    applicationDate: "2024-01-12",
    status: "documentos_pendientes",
    documents: ["DNI"],
    parentName: "Carmen Fernández",
    parentPhone: "987654323",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadEnrollments()
  setupEventListeners()
})

// Load enrollments into table
function loadEnrollments() {
  const tbody = document.getElementById("enrollmentsTableBody")
  tbody.innerHTML = ""

  enrollments.forEach((enrollment) => {
    const row = document.createElement("tr")
    row.className = "border-b border-neutral-100 hover:bg-neutral-50"

    row.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                    <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        ${enrollment.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-medium text-neutral-900">${enrollment.studentName}</p>
                        <p class="text-sm text-neutral-500">${enrollment.parentName}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-neutral-900">${enrollment.grade}</td>
            <td class="py-4 px-6 text-neutral-600">${formatDate(enrollment.applicationDate)}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(enrollment.status)}">
                    ${getStatusDisplayName(enrollment.status)}
                </span>
            </td>
            <td class="py-4 px-6">
                <div class="flex space-x-1">
                    ${enrollment.documents
                      .map((doc) => `<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">${doc}</span>`)
                      .join("")}
                </div>
            </td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button onclick="viewEnrollment(${enrollment.id})" class="text-blue-600 hover:text-blue-800" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editEnrollment(${enrollment.id})" class="text-green-600 hover:text-green-800" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${
                      enrollment.status === "pendiente"
                        ? `<button onclick="approveEnrollment(${enrollment.id})" class="text-green-600 hover:text-green-800" title="Aprobar">
                            <i class="fas fa-check"></i>
                        </button>`
                        : ""
                    }
                    <button onclick="generateEnrollmentDocument(${enrollment.id})" class="text-purple-600 hover:text-purple-800" title="Generar comprobante">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Helper functions
function getStatusBadgeClass(status) {
  const classes = {
    pendiente: "bg-yellow-100 text-yellow-800",
    aprobado: "bg-green-100 text-green-800",
    rechazado: "bg-red-100 text-red-800",
    documentos_pendientes: "bg-orange-100 text-orange-800",
  }
  return classes[status] || "bg-gray-100 text-gray-800"
}

function getStatusDisplayName(status) {
  const names = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    documentos_pendientes: "Docs. Pendientes",
  }
  return names[status] || status
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

// Modal functions
function showEnrollmentModal() {
  document.getElementById("enrollmentForm").reset()
  document.getElementById("enrollmentModal").classList.remove("hidden")
  document.getElementById("enrollmentModal").classList.add("flex")
}

function closeEnrollmentModal() {
  document.getElementById("enrollmentModal").classList.add("hidden")
  document.getElementById("enrollmentModal").classList.remove("flex")
}

// Enrollment functions
function viewEnrollment(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId)
  if (enrollment) {
    alert(`Detalles de la matrícula:
        
Estudiante: ${enrollment.studentName}
Grado: ${enrollment.grade}
Fecha de solicitud: ${formatDate(enrollment.applicationDate)}
Estado: ${getStatusDisplayName(enrollment.status)}
Apoderado: ${enrollment.parentName}
Teléfono: ${enrollment.parentPhone}
Documentos: ${enrollment.documents.join(", ")}`)
  }
}

function editEnrollment(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId)
  if (enrollment) {
    showNotification(`Editando matrícula de ${enrollment.studentName}`, "info")
    // In a real app, this would populate the modal with existing data
  }
}

function approveEnrollment(enrollmentId) {
  if (confirm("¿Está seguro de que desea aprobar esta matrícula?")) {
    const enrollment = enrollments.find((e) => e.id === enrollmentId)
    if (enrollment) {
      enrollment.status = "aprobado"
      loadEnrollments()
      showNotification(`Matrícula de ${enrollment.studentName} aprobada correctamente`, "success")
    }
  }
}

function generateEnrollmentDocument(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId)
  if (enrollment) {
    showNotification(`Generando comprobante de matrícula para ${enrollment.studentName}`, "success")
    // In a real app, this would generate and download a PDF
  }
}

// Document generation functions
function generateDocument(type) {
  const typeNames = {
    comprobante: "Comprobante de Matrícula",
    ficha: "Ficha de Datos",
    carnet: "Carnet Estudiantil",
  }

  showNotification(`Generando ${typeNames[type]}...`, "success")
  // In a real app, this would generate the specific document
}

// Report generation functions
function generateReport(type) {
  const typeNames = {
    matriculas: "Reporte de Matrículas",
    pendientes: "Documentos Pendientes",
    estadisticas: "Estadísticas Generales",
  }

  showNotification(`Generando ${typeNames[type]}...`, "success")
  // In a real app, this would generate the specific report
}

// Bulk actions
function bulkActions(action) {
  const actionNames = {
    approve: "Aprobar matrículas pendientes",
    notify: "Notificar a padres de familia",
    export: "Exportar datos de matrícula",
  }

  if (confirm(`¿Está seguro de que desea ${actionNames[action]}?`)) {
    showNotification(`${actionNames[action]} ejecutado correctamente`, "success")
    // In a real app, this would perform the bulk action
  }
}

// Setup event listeners
function setupEventListeners() {
  // Form submission
  document.getElementById("enrollmentForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = {
      studentName: `${document.getElementById("studentFirstName").value} ${document.getElementById("studentLastName").value}`,
      grade: `${document.getElementById("studentGrade").value}° Primaria ${document.getElementById("studentSection").value}`,
      applicationDate: new Date().toISOString().split("T")[0],
      status: "pendiente",
      documents: ["DNI"], // Default documents
      parentName: document.getElementById("parentName").value,
      parentPhone: document.getElementById("parentPhone").value,
    }

    // Add new enrollment (in real app, this would be an API call)
    const newEnrollment = {
      id: enrollments.length + 1,
      ...formData,
    }

    enrollments.push(newEnrollment)
    loadEnrollments()
    closeEnrollmentModal()
    showNotification("Matrícula registrada correctamente", "success")
  })
}

// Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  }`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Logout function
function logout() {
  if (confirm("¿Está seguro de que desea cerrar sesión?")) {
    window.location.href = "../login.html"
  }
}
