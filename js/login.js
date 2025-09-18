let currentUserType = "padre"

function switchUserType(type) {
  currentUserType = type

  // Update active button
  document.querySelectorAll(".user-type-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-type="${type}"]`).classList.add("active")
}

function togglePassword() {
  const passwordInput = document.getElementById("password")
  const toggleIcon = document.getElementById("passwordToggle")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleIcon.classList.remove("fa-eye")
    toggleIcon.classList.add("fa-eye-slash")
  } else {
    passwordInput.type = "password"
    toggleIcon.classList.remove("fa-eye-slash")
    toggleIcon.classList.add("fa-eye")
  }
}

function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const loginBtn = document.getElementById("loginBtn")

  // Show loading state
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Iniciando sesión...'
  loginBtn.disabled = true

  // Simulate authentication
  setTimeout(() => {
    const validCredentials = {
      padre: { username: "padre", password: "123456" },
      docente: { username: "docente", password: "123456" },
      secretaria: { username: "secretaria", password: "123456" },
      administrador: { username: "admin", password: "123456" },
    }

    const userCreds = validCredentials[currentUserType]

    if (username === userCreds.username && password === userCreds.password) {
      // Store user session
      localStorage.setItem("userType", currentUserType)
      localStorage.setItem("username", username)
      localStorage.setItem("isLoggedIn", "true")

      showToast("¡Inicio de sesión exitoso!", "success")

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1500)
    } else {
      showToast("Credenciales incorrectas. Verifica tu usuario y contraseña.", "error")
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión'
      loginBtn.disabled = false
    }
  }, 2000)
}

function showToast(message, type = "info") {
  const toast = document.createElement("div")
  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"

  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`
  toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"} mr-2"></i>
            <span>${message}</span>
        </div>
    `

  document.getElementById("toastContainer").appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-x-full")
  }, 100)

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.add("translate-x-full")
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}
