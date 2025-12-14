// Mock Booking Service
// Simulates backend API calls for appointment booking

const MOCK_BOOKINGS = []

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. Sarah Smith", specialty: "General Practice" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Surgery" },
  { id: 3, name: "Dr. Emily Brown", specialty: "Dentistry" },
]

const MOCK_SERVICES = [
  { id: 1, name: "General Checkup", duration: 30, price: 50 },
  { id: 2, name: "Vaccination", duration: 20, price: 35 },
  { id: 3, name: "Dental Cleaning", duration: 60, price: 120 },
  { id: 4, name: "Surgery Consultation", duration: 45, price: 80 },
  { id: 5, name: "Emergency Care", duration: 90, price: 200 },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const bookingService = {
  // Get available time slots for a specific date
  getAvailableSlots: async (date, doctorId) => {
    await delay(500)

    // Generate mock time slots (9 AM to 5 PM)
    const slots = []
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }

    // Randomly mark some as unavailable
    return slots.map((time) => ({
      time,
      available: Math.random() > 0.3,
    }))
  },

  // Get list of doctors
  getDoctors: async () => {
    await delay(300)
    return MOCK_DOCTORS
  },

  // Get list of services
  getServices: async () => {
    await delay(300)
    return MOCK_SERVICES
  },

  // Create new booking
  createBooking: async (bookingData) => {
    await delay(700)

    const booking = {
      id: MOCK_BOOKINGS.length + 1,
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    MOCK_BOOKINGS.push(booking)
    return booking
  },

  // Get bookings for a user
  getBookings: async (userId) => {
    await delay(400)
    return MOCK_BOOKINGS.filter((b) => b.userId === userId)
  },

  // Get bookings for a doctor
  getDoctorBookings: async (doctorId) => {
    await delay(400)
    return MOCK_BOOKINGS.filter((b) => b.doctorId === doctorId)
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    await delay(400)
    const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId)
    if (booking) {
      booking.status = "cancelled"
      return booking
    }
    throw new Error("Booking not found")
  },
}
