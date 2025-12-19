"use client"

import { useState, useEffect } from "react"
import { bookingService } from "../services/bookingService"
import { petService } from "../services/petService"
import { Calendar, Clock, MapPin, FileText, CheckCircle } from "lucide-react"

const BookingPage = () => {
  const [step, setStep] = useState(1)
  const [pets, setPets] = useState([])
  const [branches, setBranches] = useState([])
  const [services, setServices] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)

  const [bookingData, setBookingData] = useState({
    mathucung: "",
    branchId: "",
    serviceId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [petsData, branchesData, servicesData, doctorsData] = await Promise.all([
        petService.getPets(),
        bookingService.getBranches(),
        bookingService.getServices(),
        bookingService.getDoctors(),
      ])
      setPets(petsData)
      setBranches(branchesData)
      setServices(servicesData)
      setDoctors(doctorsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await bookingService.createBooking(bookingData)
      setStep(6) // Success step
    } catch (error) {
      console.error("Failed to create booking:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return bookingData.mathucung !== ""
      case 2:
        return bookingData.branchId !== ""
      case 3:
        return bookingData.serviceId !== ""
      case 4:
        return bookingData.doctorId !== "" && bookingData.date !== "" && bookingData.time !== ""
      case 5:
        return true
      default:
        return false
    }
  }

  if (step === 6) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => {
              setStep(1)
              setBookingData({
                mathucung: "",
                branchId: "",
                serviceId: "",
                doctorId: "",
                date: "",
                time: "",
                notes: "",
              })
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Schedule a visit for your pet</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 5 && <div className={`flex-1 h-1 mx-2 ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Pet</span>
            <span>Branch</span>
            <span>Service</span>
            <span>Date & Time</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Step 1: Select Pet */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Pet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <button
                    key={pet.mathucung}
                    onClick={() => setBookingData({ ...bookingData, mathucung: pet.mathucung })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      bookingData.mathucung === pet.mathucung
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-gray-900">{pet.ten}</h3>
                    <p className="text-sm text-gray-600">
                      {pet.loai} - {pet.giong}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Branch */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Branch</h2>
              <div className="space-y-4">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setBookingData({ ...bookingData, branchId: branch.id })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      bookingData.branchId === branch.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{branch.name}</h3>
                        <p className="text-sm text-gray-600">{branch.address}</p>
                        <p className="text-sm text-gray-500 mt-1">{branch.phone}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Service */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Service</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setBookingData({ ...bookingData, serviceId: service.id })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      bookingData.serviceId === service.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <p className="text-sm text-gray-500 mt-2">Duration: {service.duration}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Date, Time & Doctor */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date, Time & Doctor</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Appointment Time
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setBookingData({ ...bookingData, doctorId: doctor.id })}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          bookingData.doctorId === doctor.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
              <div className="space-y-4 bg-gray-50 rounded-lg p-6">
                <div>
                  <p className="text-sm text-gray-600">Pet</p>
                  <p className="font-semibold text-gray-900">{pets.find((p) => p.mathucung === bookingData.mathucung)?.ten}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-semibold text-gray-900">
                    {branches.find((b) => b.id === bookingData.branchId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-gray-900">
                    {services.find((s) => s.id === bookingData.serviceId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">
                    {doctors.find((d) => d.id === bookingData.doctorId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.date} at {bookingData.time}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Any special requirements or concerns..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step === 5 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
