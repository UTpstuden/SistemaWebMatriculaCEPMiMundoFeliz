// Global Variables
let currentPage = "home"
let isLoading = false
let currentTestimonial = 0

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize Application
function initializeApp() {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    })
  }

  // Setup event listeners
  setupEventListeners()

  // Setup scroll effects
  setupScrollEffects()

  // Setup testimonial carousel
  setupTestimonialCarousel()

  // Setup form validations
  setupFormValidations()

  // Setup FAQ functionality
  setupFAQ()

  // Show toast welcome message
  showToast("¡Bienvenido al CEP Mi Mundo Feliz!", "info")
}

// Event Listeners Setup
function setupEventListeners() {
  // Header scroll effect
  window.addEventListener("scroll", handleHeaderScroll)

  // Back to top visibility
  window.addEventListener("scroll", handleBackToTopVisibility)

  // Close modals on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideAllModals()
    }
  })
}

// Navigation Functions
function navigateTo(page) {
  if (isLoading || page === currentPage) return

  setLoading(true)
  updateActiveNavigation(page)

  // Hide current page with fade effect
  const currentPageElement = document.getElementById(currentPage + "-page")
  if (currentPageElement) {
    currentPageElement.classList.add("fade-out")

    setTimeout(() => {
      // Hide all pages
      document.querySelectorAll(".page-content").forEach((el) => {
        el.classList.add("hidden")
        el.classList.remove("fade-out")
      })

      // Show target page
      const targetPage = document.getElementById(page + "-page")
      if (targetPage) {
        targetPage.classList.remove("hidden")
        currentPage = page

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" })

        // Refresh AOS animations
        if (typeof AOS !== "undefined") {
          AOS.refresh()
        }
      }

      setLoading(false)
    }, 300)
  }

  // Close mobile menu if open
  closeMobileMenu()
}

function updateActiveNavigation(page) {
  // Update desktop navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })

  // Update mobile navigation
  document.querySelectorAll(".nav-link-mobile").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })
}

// Mobile Menu Functions
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu")
  const icon = document.getElementById("menu-icon")

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden")
    icon.classList.remove("fa-bars")
    icon.classList.add("fa-times")
  } else {
    menu.classList.add("hidden")
    icon.classList.remove("fa-times")
    icon.classList.add("fa-bars")
  }
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu")
  const icon = document.getElementById("menu-icon")

  menu.classList.add("hidden")
  icon.classList.remove("fa-times")
  icon.classList.add("fa-bars")
}

// Loading State
function setLoading(loading) {
  isLoading = loading
  const body = document.body

  if (loading) {
    body.style.cursor = "wait"
  } else {
    body.style.cursor = "default"
  }
}

// Header Scroll Effect
function handleHeaderScroll() {
  const header = document.getElementById("header")
  const scrolled = window.scrollY > 50

  if (scrolled) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
}

// Back to Top
function handleBackToTopVisibility() {
  const button = document.getElementById("back-to-top")
  const scrolled = window.scrollY > 300

  if (scrolled) {
    button.classList.add("show")
  } else {
    button.classList.remove("show")
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Testimonial Carousel
function setupTestimonialCarousel() {
  setInterval(() => {
    const nextIndex = (currentTestimonial + 1) % 3
    showTestimonial(nextIndex)
  }, 5000)
}

function showTestimonial(index) {
  const slides = document.querySelectorAll(".testimonial-slide")
  const indicators = document.querySelectorAll(".testimonial-indicator")

  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"))
  indicators.forEach((indicator) => indicator.classList.remove("active"))

  // Show target slide
  slides[index].classList.add("active")
  indicators[index].classList.add("active")

  currentTestimonial = index
}

// Form Validations
function setupFormValidations() {
  // Contact Form
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmit)

    // Real-time validation
    const inputs = contactForm.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input))
      input.addEventListener("input", () => clearFieldError(input))
    })
  }

  // Login Form
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit)
  }

  // Recovery Form
  const recoveryForm = document.getElementById("recovery-form")
  if (recoveryForm) {
    recoveryForm.addEventListener("submit", handleRecoveryFormSubmit)
  }
}

function validateField(field) {
  const value = field.value.trim()
  let isValid = true
  let errorMessage = ""

  // Required field check
  if (field.required && !value) {
    isValid = false
    errorMessage = "Este campo es obligatorio"
  }

  // Email validation
  else if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Ingresa un email válido"
    }
  }

  // Phone validation
  else if (field.name === "phone" && value) {
    const phoneRegex = /^[0-9+\-\s()]+$/
    if (!phoneRegex.test(value) || value.length < 9) {
      isValid = false
      errorMessage = "Ingresa un teléfono válido"
    }
  }

  // Password validation
  else if (field.type === "password" && value) {
    if (value.length < 6) {
      isValid = false
      errorMessage = "La contraseña debe tener al menos 6 caracteres"
    }
  }

  updateFieldValidation(field, isValid, errorMessage)
  return isValid
}

function updateFieldValidation(field, isValid, errorMessage) {
  const errorElement = field.parentNode.querySelector(".error-message")

  if (isValid) {
    field.classList.remove("error")
    field.classList.add("success")
    errorElement.classList.add("hidden")
    errorElement.textContent = ""
  } else {
    field.classList.remove("success")
    field.classList.add("error")
    errorElement.classList.remove("hidden")
    errorElement.textContent = errorMessage
  }
}

function clearFieldError(field) {
  field.classList.remove("error")
  const errorElement = field.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.classList.add("hidden")
  }
}

// Form Handlers
function handleContactFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)

  // Validate all fields
  const inputs = form.querySelectorAll("input[required], textarea[required]")
  let allValid = true

  inputs.forEach((input) => {
    if (!validateField(input)) {
      allValid = false
    }
  })

  if (!allValid) {
    showToast("Por favor, corrige los errores en el formulario", "error")
    return
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...'
  submitButton.disabled = true

  // Simulate form submission
  setTimeout(() => {
    submitButton.innerHTML = originalText
    submitButton.disabled = false

    // Reset form
    form.reset()
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.classList.remove("success", "error")
    })

    showToast("¡Mensaje enviado correctamente! Te responderemos pronto.", "success")
  }, 2000)
}

function handleLoginFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const username = formData.get("username")
  const password = formData.get("password")

  // Validate fields
  const usernameField = document.getElementById("username")
  const passwordField = document.getElementById("password")

  let allValid = true

  if (!validateField(usernameField)) allValid = false
  if (!validateField(passwordField)) allValid = false

  if (!allValid) return

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Iniciando sesión...'
  submitButton.disabled = true

  // Simulate login
  setTimeout(() => {
    submitButton.innerHTML = originalText
    submitButton.disabled = false

    // Demo credentials check
    if (username === "demo" && password === "demo123") {
      showToast("¡Inicio de sesión exitoso! Redirigiendo...", "success")
      setTimeout(() => {
        navigateTo("home")
      }, 1500)
    } else {
      showToast("Credenciales incorrectas. Usa demo/demo123 para la demostración.", "error")
    }
  }, 2000)
}

function handleRecoveryFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const email = formData.get("recovery-email")

  if (!email) {
    showToast("Ingresa tu email para continuar", "error")
    return
  }

  // Show loading and simulate recovery
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...'
  submitButton.disabled = true

  setTimeout(() => {
    submitButton.innerHTML = originalText
    submitButton.disabled = false

    hideRecoveryModal()
    showToast("Enlace de recuperación enviado a tu email", "success")

    // Reset form
    form.reset()
  }, 2000)
}

// Login User Types
function switchUserType(type) {
  // Update active tab
  document.querySelectorAll(".user-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.querySelector(`[data-type="${type}"]`).classList.add("active")

  // Update description
  const descriptions = {
    padres: "Acceso para padres de familia - Consulta notas, asistencias y comunicaciones",
    estudiantes: "Acceso para estudiantes - Plataforma educativa y recursos de aprendizaje",
    docentes: "Acceso para docentes - Herramientas pedagógicas y gestión académica",
  }

  document.getElementById("user-description").textContent = descriptions[type]
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const passwordField = document.getElementById("password")
  const toggleIcon = document.getElementById("password-toggle")

  if (passwordField.type === "password") {
    passwordField.type = "text"
    toggleIcon.classList.remove("fa-eye")
    toggleIcon.classList.add("fa-eye-slash")
  } else {
    passwordField.type = "password"
    toggleIcon.classList.remove("fa-eye-slash")
    toggleIcon.classList.add("fa-eye")
  }
}

// Modal Functions
function showRecoveryModal() {
  const modal = document.getElementById("recovery-modal")
  modal.classList.remove("hidden")

  // Focus on email field
  setTimeout(() => {
    document.getElementById("recovery-email").focus()
  }, 300)
}

function hideRecoveryModal() {
  const modal = document.getElementById("recovery-modal")
  modal.classList.add("hidden")
}

function showDemoModal() {
  const modal = document.getElementById("demo-modal")
  modal.classList.remove("hidden")
}

function hideDemoModal() {
  const modal = document.getElementById("demo-modal")
  modal.classList.add("hidden")
}

function hideAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.add("hidden")
  })
}

// FAQ Functions
function setupFAQ() {
  // No additional setup needed, handled by toggleFAQ function
}

function toggleFAQ(button) {
  const answer = button.parentNode.querySelector(".faq-answer")
  const icon = button.querySelector("i")

  if (answer.classList.contains("show")) {
    answer.classList.remove("show")
    button.classList.remove("active")
  } else {
    // Close all other FAQs
    document.querySelectorAll(".faq-answer.show").forEach((openAnswer) => {
      openAnswer.classList.remove("show")
    })
    document.querySelectorAll(".faq-question.active").forEach((activeButton) => {
      activeButton.classList.remove("active")
    })

    // Open current FAQ
    answer.classList.add("show")
    button.classList.add("active")
  }
}

// Scroll Effects
function setupScrollEffects() {
  // Parallax effect for hero sections (optional enhancement)
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroElements = document.querySelectorAll(".hero-section, .hero-section-secondary")

    heroElements.forEach((hero) => {
      const rate = scrolled * -0.5
      hero.style.transform = `translateY(${rate}px)`
    })
  })
}

// Toast Notification System
function showToast(message, type = "info", duration = 5000) {
  const container = document.getElementById("toast-container")
  const toast = document.createElement("div")

  toast.className = `toast ${type}`
  toast.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${getToastIcon(type)} mr-3"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentNode.parentNode.remove()" class="ml-4 text-neutral-600 hover:text-primary">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  container.appendChild(toast)

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 100)

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }, duration)
}

function getToastIcon(type) {
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  }
  return icons[type] || icons.info
}

// Gallery Functions (for future lightbox implementation)
function openImageLightbox(imageSrc, title) {
  // Future implementation for image gallery
  console.log("Opening lightbox for:", imageSrc, title)
}

// Form Utilities
function sanitizeInput(input) {
  const temp = document.createElement("div")
  temp.textContent = input
  return temp.innerHTML
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[0-9+\-\s()]+$/
  return re.test(phone) && phone.length >= 9
}

// Analytics (placeholder for future implementation)
function trackEvent(category, action, label) {
  console.log("Analytics:", { category, action, label })
  // Future: Google Analytics or other tracking
}

// Smooth scroll for internal links
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId)
  if (target) {
    target.scrollIntoView({ behavior: "smooth" })
  }
}

// Performance monitoring
function logPerformance() {
  if (performance.navigation) {
    console.log("Page load type:", performance.navigation.type)
    console.log("Load time:", performance.timing.loadEventEnd - performance.timing.navigationStart, "ms")
  }
}

// Initialize performance logging
window.addEventListener("load", logPerformance)

// Error handling for images
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      e.target.style.display = "none"
      console.log("Image failed to load:", e.target.src)
    }
  },
  true,
)

// Service Worker Registration (optional for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('SW registered'))
    //     .catch(err => console.log('SW registration failed'));
  })
}

// Accessibility enhancements
document.addEventListener("keydown", (e) => {
  // Tab navigation enhancements
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation")
  }
})

document.addEventListener("mousedown", (e) => {
  document.body.classList.remove("keyboard-navigation")
})

// Auto-save for forms (future enhancement)
function autoSaveForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return

  const inputs = form.querySelectorAll("input, textarea, select")

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const formData = {}
      const formInputs = form.querySelectorAll("input, textarea, select")
      formInputs.forEach((inp) => {
        formData[inp.name] = inp.value
      })

      localStorage.setItem(formId + "_autosave", JSON.stringify(formData))
    })
  })
}

// Load auto-saved form data
function loadAutoSavedData(formId) {
  const saved = localStorage.getItem(formId + "_autosave")
  if (saved) {
    const data = JSON.parse(saved)
    const form = document.getElementById(formId)

    Object.keys(data).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`)
      if (field) {
        field.value = data[name]
      }
    })
  }
}

// Clear auto-saved data
function clearAutoSavedData(formId) {
  localStorage.removeItem(formId + "_autosave")
}

// Initialize auto-save for contact form
document.addEventListener("DOMContentLoaded", () => {
  autoSaveForm("contact-form")
  loadAutoSavedData("contact-form")
})
