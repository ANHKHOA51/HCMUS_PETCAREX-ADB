"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PetDashboard } from "./pet-dashboard"
import { BookingWizard } from "./booking-wizard"
import { MedicalRecords } from "./medical-records"

export function ClientPortal() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">My Pets</TabsTrigger>
        <TabsTrigger value="booking">Book Appointment</TabsTrigger>
        <TabsTrigger value="records">Medical Records</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        <PetDashboard />
      </TabsContent>

      <TabsContent value="booking" className="mt-6">
        <BookingWizard />
      </TabsContent>

      <TabsContent value="records" className="mt-6">
        <MedicalRecords />
      </TabsContent>
    </Tabs>
  )
}
