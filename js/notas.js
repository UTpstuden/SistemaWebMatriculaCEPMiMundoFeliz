// Gestión de Notas - JavaScript

// Sample grades data
let grades = [
  {
    id: 1,
    studentId: 1,
    studentName: "Ana García Pérez",
    course: "matematicas",
    courseName: "Matemáticas",
    evaluationType: "examen",
    score: 18.5,
    period: 1,
    date: "2024-01-15",
    observations: "Excelente desempeño",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Carlos López Martín",
    course: "comunicacion",
    courseName: "Comunicación",
    evaluationType: "practica",
    score: 16.0,
    period: 1,
    date: "2024-01-14",
    observations: "",
  },
  {
    id: 3,
    studentId: 3,
    studentName: "María Rodríguez Silva",
    course: "ciencias",
    courseName: "Ciencias",
    evaluationType: "proyecto",
    score: 19.0,
    period: 1,
    date: "2024-01-13",
    observations: "Proyecto muy creativo",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadGrades()
  setupEventListeners()
})

// Load grades into table
function loadGrades() {
  const tbody = document.getElementById("gradesTableBody")
  tbody.innerHTML = ""

  grades.forEach((grade) => {
    const row = document.createElement("tr")
    row.className = "border-b border-neutral-100 hover:bg-neutral-50"

    row.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                    <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        ${grade.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-medium text-neutral-900">${grade.studentName}</p>
                        <p class="text-sm text-neutral-500">ID: ${grade.studentId.toString().padStart(4, "0")}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-neutral-900">${grade.courseName}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getEvaluationBadgeClass(grade.evaluationType)}">
                    ${getEvaluationDisplayName(grade.evaluationType)}
                </span>
            </td>
            <td class="py-4 px-6">
                <span class="text-lg font-bold ${getScoreColor(grade.score)}">${grade.score}</span>
            </td>
            <td class="py-4 px-6 text-neutral-900">${getPeriodName(grade.period)}</td>
            <td class="py-4 px-6 text-neutral-600">${formatDate(grade.date)}</td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button onclick="editGrade(${grade.id})" class="text-blue-600 hover:text-blue-800" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteGrade(${grade.id})" class="text-red-600 hover:text-red-800" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewDetails(${grade.id})" class="text-green-600 hover:text-green-800" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Helper functions
function getEvaluationBadgeClass(type) {
  const classes = {
    examen: "bg-red-100 text-red-800",
    practica: "bg-blue-100 text-blue-800",
    tarea: "bg-green-100 text-green-800",
    proyecto: "bg-purple-100 text-purple-800",
  }
  return classes[type] || "bg-gray-100 text-gray-800"
}

function getEvaluationDisplayName(type) {
  const names = {
    examen: "Examen",
    practica: "Práctica",
    tarea: "Tarea",
    proyecto: "Proyecto",
  }
  return names[type] || type
}

function getScoreColor(score) {
  if (score >= 18) return "text-green-600"
  if (score >= 14) return "text-blue-600"
  if (score >= 11) return "text-orange-600"
  return "text-red-600"
}

function getPeriodName(period) {
  const names = {
    1: "I Bimestre",
    2: "II Bimestre",
    3: "III Bimestre",
    4: "IV Bimestre",
  }
  return names[period] || `Periodo ${period}`
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

// Modal functions
function showGradeModal() {
  document.getElementById("gradeModalTitle").textContent = "Registrar Nota"
  document.getElementById("gradeForm").reset()
  document.getElementById("gradeModal").classList.remove("hidden")
  document.getElementById("gradeModal").classList.add("flex")
}

function closeGradeModal() {
  document.getElementById("gradeModal").classList.add("hidden")
  document.getElementById("gradeModal").classList.remove("flex")
}

function editGrade(gradeId) {
  const grade = grades.find((g) => g.id === gradeId)
  if (grade) {
    document.getElementById("gradeModalTitle").textContent = "Editar Nota"
    document.getElementById("gradeStudent").value = grade.studentId
    document.getElementById("gradeCourse").value = grade.course
    document.getElementById("gradeType").value = grade.evaluationType
    document.getElementById("gradeScore").value = grade.score
    document.getElementById("gradePeriod").value = grade.period
    document.getElementById("gradeObservations").value = grade.observations

    document.getElementById("gradeModal").classList.remove("hidden")
    document.getElementById("gradeModal").classList.add("flex")
  }
}

function deleteGrade(gradeId) {
  if (confirm("¿Está seguro de que desea eliminar esta calificación?")) {
    grades = grades.filter((g) => g.id !== gradeId)
    loadGrades()
    showNotification("Calificación eliminada correctamente", "success")
  }
}

function viewDetails(gradeId) {
  const grade = grades.find((g) => g.id === gradeId)
  if (grade) {
    alert(`Detalles de la calificación:
        
Estudiante: ${grade.studentName}
Curso: ${grade.courseName}
Evaluación: ${getEvaluationDisplayName(grade.evaluationType)}
Nota: ${grade.score}
Periodo: ${getPeriodName(grade.period)}
Fecha: ${formatDate(grade.date)}
Observaciones: ${grade.observations || "Sin observaciones"}`)
  }
}

function exportGrades() {
  showNotification("Exportando calificaciones a Excel...", "success")
  // In a real app, this would generate and download an Excel file
}

// Setup event listeners
function setupEventListeners() {
  // Form submission
  document.getElementById("gradeForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = {
      studentId: Number.parseInt(document.getElementById("gradeStudent").value),
      studentName: document.getElementById("gradeStudent").selectedOptions[0].text,
      course: document.getElementById("gradeCourse").value,
      courseName: document.getElementById("gradeCourse").selectedOptions[0].text,
      evaluationType: document.getElementById("gradeType").value,
      score: Number.parseFloat(document.getElementById("gradeScore").value),
      period: Number.parseInt(document.getElementById("gradePeriod").value),
      date: new Date().toISOString().split("T")[0],
      observations: document.getElementById("gradeObservations").value,
    }

    // Add new grade (in real app, this would be an API call)
    const newGrade = {
      id: grades.length + 1,
      ...formData,
    }

    grades.push(newGrade)
    loadGrades()
    closeGradeModal()
    showNotification("Calificación guardada correctamente", "success")
  })

  // Filters
  document.getElementById("courseFilter").addEventListener("change", filterGrades)
  document.getElementById("gradeFilter").addEventListener("change", filterGrades)
  document.getElementById("periodFilter").addEventListener("change", filterGrades)
  document.getElementById("studentSearch").addEventListener("input", filterGrades)
}

function filterGrades() {
  // In a real app, this would filter the grades array and reload the table
  showNotification("Filtros aplicados", "info")
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
