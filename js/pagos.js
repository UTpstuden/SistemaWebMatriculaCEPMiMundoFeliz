// Payment Management JavaScript

// Sample payment data
const paymentsData = [
  {
    id: 1,
    student: "Ana García López",
    grade: "3° Primaria",
    concept: "Pensión Marzo",
    amount: 250.0,
    dueDate: "2024-03-15",
    status: "pending",
    method: "",
  },
  {
    id: 2,
    student: "Carlos Mendoza Silva",
    grade: "5° Primaria",
    concept: "Matrícula 2024",
    amount: 350.0,
    dueDate: "2024-02-28",
    status: "paid",
    method: "Transferencia",
  },
  {
    id: 3,
    student: "María Rodríguez Torres",
    grade: "1° Primaria",
    concept: "Materiales",
    amount: 120.0,
    dueDate: "2024-03-20",
    status: "overdue",
    method: "",
  },
  {
    id: 4,
    student: "José Fernández Ruiz",
    grade: "4° Primaria",
    concept: "Pensión Marzo",
    amount: 250.0,
    dueDate: "2024-03-15",
    status: "paid",
    method: "Efectivo",
  },
  {
    id: 5,
    student: "Lucía Vargas Morales",
    grade: "2° Primaria",
    concept: "Actividades",
    amount: 80.0,
    dueDate: "2024-03-25",
    status: "pending",
    method: "",
  },
]

// Initialize payments page
document.addEventListener("DOMContentLoaded", () => {
  loadPaymentsTable()
  setupEventListeners()
})

// Load payments table
function loadPaymentsTable() {
  const tbody = document.getElementById("paymentsTableBody")
  if (!tbody) return

  tbody.innerHTML = ""

  paymentsData.forEach((payment) => {
    const row = document.createElement("tr")
    row.className = "border-b border-neutral-200 hover:bg-neutral-50"

    const statusClass = getStatusClass(payment.status)
    const statusText = getStatusText(payment.status)

    row.innerHTML = `
            <td class="p-4">
                <div class="font-medium text-neutral-900">${payment.student}</div>
            </td>
            <td class="p-4 text-neutral-600">${payment.grade}</td>
            <td class="p-4 text-neutral-600">${payment.concept}</td>
            <td class="p-4 font-semibold text-neutral-900">S/ ${payment.amount.toFixed(2)}</td>
            <td class="p-4 text-neutral-600">${formatDate(payment.dueDate)}</td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="p-4">
                <div class="flex space-x-2">
                    ${
                      payment.status === "pending" || payment.status === "overdue"
                        ? `<button onclick="markAsPaid(${payment.id})" class="text-green-600 hover:text-green-800" title="Marcar como pagado">
                            <i class="fas fa-check"></i>
                        </button>`
                        : ""
                    }
                    <button onclick="viewPaymentDetails(${payment.id})" class="text-blue-600 hover:text-blue-800" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="generateReceipt(${payment.id})" class="text-purple-600 hover:text-purple-800" title="Generar comprobante">
                        <i class="fas fa-receipt"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Get status class for styling
function getStatusClass(status) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get status text
function getStatusText(status) {
  switch (status) {
    case "paid":
      return "Pagado"
    case "pending":
      return "Pendiente"
    case "overdue":
      return "Vencido"
    default:
      return "Desconocido"
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Setup event listeners
function setupEventListeners() {
  // Payment form submission
  const paymentForm = document.getElementById("paymentForm")
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault()
      registerPayment()
    })
  }
}

// Show payment modal
function showPaymentModal() {
  const modal = document.getElementById("paymentModal")
  if (modal) {
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }
}

// Close payment modal
function closePaymentModal() {
  const modal = document.getElementById("paymentModal")
  if (modal) {
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }
}

// Register new payment
function registerPayment() {
  // Here you would normally send data to server
  alert("Pago registrado exitosamente")
  closePaymentModal()
  loadPaymentsTable()
}

// Mark payment as paid
function markAsPaid(paymentId) {
  const payment = paymentsData.find((p) => p.id === paymentId)
  if (payment) {
    payment.status = "paid"
    payment.method = "Efectivo" // Default method
    loadPaymentsTable()
    alert("Pago marcado como pagado")
  }
}

// View payment details
function viewPaymentDetails(paymentId) {
  const payment = paymentsData.find((p) => p.id === paymentId)
  if (payment) {
    alert(
      `Detalles del pago:\nEstudiante: ${payment.student}\nConcepto: ${payment.concept}\nMonto: S/ ${payment.amount.toFixed(2)}\nEstado: ${getStatusText(payment.status)}`,
    )
  }
}

// Generate receipt
function generateReceipt(paymentId) {
  const payment = paymentsData.find((p) => p.id === paymentId)
  if (payment && payment.status === "paid") {
    // Here you would generate a PDF receipt
    alert("Generando comprobante de pago...")
  } else {
    alert("Solo se pueden generar comprobantes para pagos realizados")
  }
}

// Generate report
function generateReport() {
  alert("Generando reporte de pagos...")
}
