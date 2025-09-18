// Gestión de Usuarios - JavaScript

// Sample users data
let users = [
  {
    id: 1,
    name: "María García",
    email: "maria.garcia@colegio.edu",
    role: "docente",
    status: "activo",
    lastAccess: "2024-01-15 09:30",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@gmail.com",
    role: "padre",
    status: "activo",
    lastAccess: "2024-01-14 18:45",
  },
  {
    id: 3,
    name: "Ana López",
    email: "ana.lopez@colegio.edu",
    role: "secretaria",
    status: "activo",
    lastAccess: "2024-01-15 08:15",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadUsers()
  setupEventListeners()
})

// Load users into table
function loadUsers() {
  const tbody = document.getElementById("usersTableBody")
  tbody.innerHTML = ""

  users.forEach((user) => {
    const row = document.createElement("tr")
    row.className = "border-b border-neutral-100 hover:bg-neutral-50"

    row.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center space-x-3">
                    <div class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-medium text-neutral-900">${user.name}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-neutral-600">${user.email}</td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}">
                    ${getRoleDisplayName(user.role)}
                </span>
            </td>
            <td class="py-4 px-6">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.status)}">
                    ${user.status === "activo" ? "Activo" : "Inactivo"}
                </span>
            </td>
            <td class="py-4 px-6 text-neutral-600">${formatDate(user.lastAccess)}</td>
            <td class="py-4 px-6">
                <div class="flex space-x-2">
                    <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="resetPassword(${user.id})" class="text-green-600 hover:text-green-800">
                        <i class="fas fa-key"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(row)
  })
}

// Helper functions
function getRoleBadgeClass(role) {
  const classes = {
    docente: "bg-green-100 text-green-800",
    padre: "bg-purple-100 text-purple-800",
    secretaria: "bg-orange-100 text-orange-800",
    administrador: "bg-blue-100 text-blue-800",
  }
  return classes[role] || "bg-gray-100 text-gray-800"
}

function getRoleDisplayName(role) {
  const names = {
    docente: "Docente",
    padre: "Padre",
    secretaria: "Secretaria",
    administrador: "Administrador",
  }
  return names[role] || role
}

function getStatusBadgeClass(status) {
  return status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return (
    date.toLocaleDateString("es-ES") + " " + date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  )
}

// Modal functions
function showCreateUserModal() {
  document.getElementById("modalTitle").textContent = "Crear Usuario"
  document.getElementById("userForm").reset()
  document.getElementById("userModal").classList.remove("hidden")
  document.getElementById("userModal").classList.add("flex")
}

function closeUserModal() {
  document.getElementById("userModal").classList.add("hidden")
  document.getElementById("userModal").classList.remove("flex")
}

function editUser(userId) {
  const user = users.find((u) => u.id === userId)
  if (user) {
    document.getElementById("modalTitle").textContent = "Editar Usuario"
    document.getElementById("userName").value = user.name
    document.getElementById("userEmail").value = user.email
    document.getElementById("userRole").value = user.role
    document.getElementById("userStatus").value = user.status
    document.getElementById("userPassword").value = ""
    document.getElementById("userPassword").placeholder = "Dejar vacío para mantener contraseña actual"

    document.getElementById("userModal").classList.remove("hidden")
    document.getElementById("userModal").classList.add("flex")
  }
}

function deleteUser(userId) {
  if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
    users = users.filter((u) => u.id !== userId)
    loadUsers()
    showNotification("Usuario eliminado correctamente", "success")
  }
}

function resetPassword(userId) {
  if (confirm("¿Está seguro de que desea restablecer la contraseña de este usuario?")) {
    showNotification("Contraseña restablecida. Nueva contraseña enviada por email.", "success")
  }
}

// Setup event listeners
function setupEventListeners() {
  // Form submission
  document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      role: document.getElementById("userRole").value,
      status: document.getElementById("userStatus").value,
      password: document.getElementById("userPassword").value,
    }

    // Add new user (in real app, this would be an API call)
    const newUser = {
      id: users.length + 1,
      ...formData,
      lastAccess: new Date().toISOString().slice(0, 16).replace("T", " "),
    }

    users.push(newUser)
    loadUsers()
    closeUserModal()
    showNotification("Usuario guardado correctamente", "success")
  })
}

// Notification function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  }`
  notification.textContent = message

  document.body.appendChild(notification)

  // Remove after 3 seconds
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
