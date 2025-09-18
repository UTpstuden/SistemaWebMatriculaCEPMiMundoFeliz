// Gestión de Nómina - JavaScript

// Sample payroll data
const employees = [
  {
    id: 1,
    name: "María García Pérez",
    position: "Docente - Matemáticas",
    department: "docente",
    baseSalary: 2800,
    bonuses: 300,
    deductions: 420,
    status: "pagado",
  },
  {
    id: 2,
    name: "Carlos Rodríguez López",
    position: "Director Académico",
    department: "administrativo",
    baseSalary: 4500,
    bonuses: 500,
    deductions: 675,
    status: "pendiente",
  },
  {
    id: 3,
    name: "Ana López Martín",
    position: "Secretaria",
    department: "administrativo",
    baseSalary: 1800,
    bonuses: 150,
    deductions: 270,
    status: "pagado",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadPayrollData()
  setupEventListeners()
})

// Load payroll data into table
function loadPayrollData() {
  const tbody = document.getElementById("payrollTableBody")
  tbody.innerHTML = ""

  employees.forEach((employee) => {
    const total = employee.baseSalary + employee.bonuses - employee.deductions
    const row = document.createElement("tr")
    row.className = "border-b border-neutral-100 hover:bg-neutral-50"

    row.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                    <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        ${employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-medium text-neutral-900">${employee.name}</p>
                        <p class="text-sm text-neutral-500">ID: ${employee.id.toString().padStart(4, "0")}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6">
                <p class="text-neutral-900">${employee.position}</p>
                <p class="text-sm text-neutral-500">${getDepartmentName(employee.department)}</p>
            </td>
            <td class="py-4 px-6 text-neutral-900 font-medium">S/. ${employee.baseSalary.toLocaleString()}</td>
            <td class="py-4 px-6 text-green-600 font-medium">S/. ${employee.bonuses.toLocaleString()}</td>
            <td class="py-4 px-6 text-red-600 font-medium">S/. ${employee.deductions.toLocaleString()}</td>
            <td class="py-4 px-6 text-primary font-bold">S/. ${total.toLocaleString()}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(employee.status)}">
                    ${employee.status === "pagado" ? "Pagado" : "Pendiente"}
                </span>
            </td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button onclick="viewPayslip(${employee.id})" class="text-blue-600 hover:text-blue-800" title="Ver boleta">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editEmployee(${employee.id})" class="text-green-600 hover:text-green-800" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="generatePayslip(${employee.id})" class="text-purple-600 hover:text-purple-800" title="Generar boleta">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    ${
                      employee.status === "pendiente"
                        ? `<button onclick="markAsPaid(${employee.id})" class="text-green-600 hover:text-green-800" title="Marcar como pagado">
                            <i class="fas fa-check"></i>
                        </button>`
                        : ""
                    }
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Helper functions
function getDepartmentName(department) {
  const names = {
    docente: "Docentes",
    administrativo: "Administrativo",
    mantenimiento: "Mantenimiento",
  }
  return names[department] || department
}

function getStatusBadgeClass(status) {
  return status === "pagado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
}

// Payroll functions
function generatePayroll() {
  if (confirm("¿Está seguro de que desea generar la nómina para este mes?")) {
    showNotification("Nómina generada correctamente", "success")
    // In a real app, this would calculate and generate payroll
  }
}

function viewPayslip(employeeId) {
  const employee = employees.find((e) => e.id === employeeId)
  if (employee) {
    showNotification(`Mostrando boleta de pago de ${employee.name}`, "info")
    // In a real app, this would open a payslip viewer
  }
}

function editEmployee(employeeId) {
  const employee = employees.find((e) => e.id === employeeId)
  if (employee) {
    showNotification(`Editando datos de ${employee.name}`, "info")
    // In a real app, this would open an edit modal
  }
}

function generatePayslip(employeeId) {
  const employee = employees.find((e) => e.id === employeeId)
  if (employee) {
    showNotification(`Generando boleta PDF para ${employee.name}`, "success")
    // In a real app, this would generate and download a PDF
  }
}

function markAsPaid(employeeId) {
  if (confirm("¿Confirmar que se ha realizado el pago?")) {
    const employee = employees.find((e) => e.id === employeeId)
    if (employee) {
      employee.status = "pagado"
      loadPayrollData()
      showNotification(`Pago confirmado para ${employee.name}`, "success")
    }
  }
}

// Setup event listeners
function setupEventListeners() {
  // Department filter
  const departmentFilter = document.querySelector("select")
  departmentFilter.addEventListener("change", () => {
    // In a real app, this would filter the table
    showNotification("Filtro aplicado", "info")
  })

  // Month filter
  const monthFilter = document.querySelector('input[type="month"]')
  monthFilter.addEventListener("change", function () {
    // In a real app, this would load data for the selected month
    showNotification(`Cargando datos para ${this.value}`, "info")
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
