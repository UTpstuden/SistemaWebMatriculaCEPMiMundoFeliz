let stream = null
let scanning = false

function startCamera() {
  const video = document.getElementById("qrVideo")
  const placeholder = document.getElementById("cameraPlaceholder")
  const scanningOverlay = document.getElementById("scanningOverlay")
  const startBtn = document.getElementById("startScanBtn")
  const stopBtn = document.getElementById("stopScanBtn")

  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    })
    .then((mediaStream) => {
      stream = mediaStream
      video.srcObject = stream
      video.style.display = "block"
      placeholder.style.display = "none"
      scanningOverlay.style.display = "flex"
      startBtn.style.display = "none"
      stopBtn.style.display = "block"

      video.play()
      scanning = true

      showStatus("Cámara activada. Apunta hacia el código QR", "success")

      // Start QR scanning simulation
      simulateQRScanning()
    })
    .catch((err) => {
      console.error("Error accessing camera:", err)
      showStatus("Error al acceder a la cámara. Verifica los permisos.", "error")
    })
}

function stopCamera() {
  const video = document.getElementById("qrVideo")
  const placeholder = document.getElementById("cameraPlaceholder")
  const scanningOverlay = document.getElementById("scanningOverlay")
  const startBtn = document.getElementById("startScanBtn")
  const stopBtn = document.getElementById("stopScanBtn")

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }

  video.style.display = "none"
  placeholder.style.display = "flex"
  scanningOverlay.style.display = "none"
  startBtn.style.display = "block"
  stopBtn.style.display = "none"

  scanning = false

  showStatus("Cámara desactivada", "info")
}

function simulateQRScanning() {
  if (!scanning) return

  // Simulate QR code detection after 5 seconds
  setTimeout(() => {
    if (scanning) {
      // Simulate successful QR scan
      const mockStudentData = {
        id: "EST001",
        name: "Juan Carlos Pérez",
        grade: "5to Grado",
        section: "A",
      }

      handleSuccessfulScan(mockStudentData)
    }
  }, 5000)
}

function handleSuccessfulScan(studentData) {
  scanning = false

  // Show success animation
  showStatus(
    `¡Asistencia registrada!<br><strong>${studentData.name}</strong><br>${studentData.grade} - Sección ${studentData.section}`,
    "success",
  )

  // Stop camera after successful scan
  setTimeout(() => {
    stopCamera()

    // Redirect back to dashboard or show completion message
    setTimeout(() => {
      if (confirm("¿Deseas registrar otra asistencia?")) {
        // Reset for another scan
        document.getElementById("statusMessage").style.display = "none"
      } else {
        // Redirect to dashboard
        window.location.href = "../dashboard.html"
      }
    }, 2000)
  }, 3000)
}

function showStatus(message, type) {
  const statusDiv = document.getElementById("statusMessage")
  statusDiv.style.display = "block"
  statusDiv.innerHTML = message

  // Remove existing classes
  statusDiv.className = "mt-4 p-3 rounded-lg text-center"

  // Add type-specific classes
  switch (type) {
    case "success":
      statusDiv.classList.add("bg-green-100", "text-green-800", "border", "border-green-200")
      break
    case "error":
      statusDiv.classList.add("bg-red-100", "text-red-800", "border", "border-red-200")
      break
    case "info":
      statusDiv.classList.add("bg-blue-100", "text-blue-800", "border", "border-blue-200")
      break
    default:
      statusDiv.classList.add("bg-neutral-100", "text-neutral-800", "border", "border-neutral-200")
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Check if camera is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showStatus("Tu dispositivo no soporta acceso a la cámara", "error")
    document.getElementById("startScanBtn").disabled = true
  }
})
