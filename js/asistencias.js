// Sample student data
const studentsData = {
  "1A": [
    { id: "001", name: "Ana María González", status: "present" },
    { id: "002", name: "Carlos Rodríguez", status: "absent" },
    { id: "003", name: "María José López", status: "present" },
    { id: "004", name: "Luis Fernando Martín", status: "late" },
    { id: "005", name: "Sofía Hernández", status: "present" },
  ],
  "2A": [
    { id: "006", name: "Diego Alejandro Pérez", status: "present" },
    { id: "007", name: "Isabella Torres", status: "present" },
    { id: "008", name: "Mateo Jiménez", status: "absent" },
    { id: "009", name: "Valentina Ruiz", status: "present" },
    { id: "010", name: "Santiago Morales", status: "present" },
  ],
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Set today's date
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("attendanceDate").value = today

  // Add event listeners
  document.getElementById("gradeSelect").addEventListener("change", loadStudents)
  document.getElementById("sectionSelect").addEventListener("change", loadStudents)
})

function loadStudents() {
  const grade = document.getElementById("gradeSelect").value
  const section = document.getElementById("sectionSelect").value
  const attendanceList = document.getElementById("attendanceList")

  if (!grade || !section) {
    attendanceList.innerHTML = `
            <div class="text-center text-neutral-500 py-8">
                <i class="fas fa-users text-4xl mb-4"></i>
                <p>Selecciona un grado y sección para ver la lista de estudiantes</p>
            </div>
        `
    return
  }

  const key = grade + section
  const students = studentsData[key] || []

  if (students.length === 0) {
    attendanceList.innerHTML = `
            <div class="text-center text-neutral-500 py-8">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>No hay estudiantes registrados para ${grade}° Grado - Sección ${section}</p>
            </div>
        `
    return
  }

  attendanceList.innerHTML = students
    .map(
      (student) => `
        <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    ${student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                </div>
                <div>
                    <p class="font-medium text-primary">${student.name}</p>
                    <p class="text-sm text-neutral-600">ID: ${student.id}</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-2">
                <button onclick="markAttendance('${student.id}', 'present')" 
                        class="attendance-btn ${student.status === "present" ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"} px-3 py-1 rounded-lg text-sm hover:bg-green-500 hover:text-white transition-colors">
                    <i class="fas fa-check mr-1"></i>Presente
                </button>
                <button onclick="markAttendance('${student.id}', 'late')" 
                        class="attendance-btn ${student.status === "late" ? "bg-yellow-500 text-white" : "bg-neutral-200 text-neutral-600"} px-3 py-1 rounded-lg text-sm hover:bg-yellow-500 hover:text-white transition-colors">
                    <i class="fas fa-clock mr-1"></i>Tardanza
                </button>
                <button onclick="markAttendance('${student.id}', 'absent')" 
                        class="attendance-btn ${student.status === "absent" ? "bg-red-500 text-white" : "bg-neutral-200 text-neutral-600"} px-3 py-1 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors">
                    <i class="fas fa-times mr-1"></i>Ausente
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function markAttendance(studentId, status) {
  const grade = document.getElementById("gradeSelect").value
  const section = document.getElementById("sectionSelect").value
  const key = grade + section

  if (studentsData[key]) {
    const student = studentsData[key].find((s) => s.id === studentId)
    if (student) {
      student.status = status
      loadStudents() // Refresh the list
    }
  }
}

function markAllPresent() {
  const grade = document.getElementById("gradeSelect").value
  const section = document.getElementById("sectionSelect").value

  if (!grade || !section) {
    alert("Por favor selecciona un grado y sección primero")
    return
  }

  const key = grade + section
  if (studentsData[key]) {
    studentsData[key].forEach((student) => {
      student.status = "present"
    })
    loadStudents()
  }
}

function saveAttendance() {
  const date = document.getElementById("attendanceDate").value
  const grade = document.getElementById("gradeSelect").value
  const section = document.getElementById("sectionSelect").value

  if (!date || !grade || !section) {
    alert("Por favor completa todos los campos")
    return
  }

  // Simulate saving attendance
  const attendanceData = {
    date: date,
    grade: grade,
    section: section,
    students: studentsData[grade + section] || [],
  }

  console.log("Guardando asistencia:", attendanceData)

  // Show success message
  const statusDiv = document.createElement("div")
  statusDiv.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
  statusDiv.innerHTML = '<i class="fas fa-check mr-2"></i>Asistencia guardada correctamente'
  document.body.appendChild(statusDiv)

  setTimeout(() => {
    statusDiv.remove()
  }, 3000)
}

// QR Scanner functions
function openQRScanner() {
  document.getElementById("qrModal").classList.remove("hidden")
}

function closeQRScanner() {
  document.getElementById("qrModal").classList.add("hidden")
  stopQRScanner()
}

function startQRScanner() {
  const video = document.getElementById("qrVideo")
  const placeholder = document.getElementById("qrPlaceholder")

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream
      video.style.display = "block"
      placeholder.style.display = "none"
      video.play()

      // Start QR detection (simplified version)
      scanQRCode(video)
    })
    .catch((err) => {
      console.error("Error accessing camera:", err)
      placeholder.innerHTML = `
                <i class="fas fa-exclamation-triangle text-4xl mb-2 text-red-500"></i>
                <p class="text-red-500">Error al acceder a la cámara</p>
            `
    })
}

function stopQRScanner() {
  const video = document.getElementById("qrVideo")
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop())
    video.srcObject = null
  }
  video.style.display = "none"
  document.getElementById("qrPlaceholder").style.display = "flex"
}

function scanQRCode(video) {
  // Simplified QR scanning simulation
  // In a real implementation, you would use a QR code library like jsQR
  setTimeout(() => {
    // Simulate QR code detection
    const mockQRData = "STUDENT_ID_001"
    handleQRDetection(mockQRData)
  }, 3000)
}

function handleQRDetection(qrData) {
  console.log("QR Code detected:", qrData)

  // Process QR data and mark attendance
  if (qrData.startsWith("STUDENT_ID_")) {
    const studentId = qrData.replace("STUDENT_ID_", "")
    markAttendance(studentId, "present")

    // Show success message
    alert(`Asistencia registrada para estudiante ID: ${studentId}`)
    closeQRScanner()
  }
}
