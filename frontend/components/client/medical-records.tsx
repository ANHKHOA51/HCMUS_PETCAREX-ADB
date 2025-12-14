"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Calendar, Stethoscope, Syringe, CheckCircle2, Clock } from "lucide-react"

const medicalHistory = [
  {
    id: "1",
    date: "2024-12-01",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "Annual Health Checkup",
    symptoms: "Routine examination, no issues found",
    prescription: "Multivitamin supplement - 1 tablet daily for 30 days",
  },
  {
    id: "2",
    date: "2024-09-15",
    doctor: "Dr. Michael Chen",
    diagnosis: "Skin Allergy",
    symptoms: "Itching, redness on belly area",
    prescription: "Antihistamine cream - Apply twice daily, Allergy tablets - 1/2 tablet daily",
  },
  {
    id: "3",
    date: "2024-06-20",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "Ear Infection",
    symptoms: "Scratching ears, head shaking",
    prescription: "Ear drops - 3 drops twice daily for 7 days",
  },
]

const vaccinationHistory = [
  {
    id: "1",
    date: "2024-11-10",
    vaccine: "Rabies Vaccine",
    nextDue: "2025-11-10",
    status: "completed",
  },
  {
    id: "2",
    date: "2024-08-05",
    vaccine: "DHPP (Distemper)",
    nextDue: "2025-08-05",
    status: "completed",
  },
  {
    id: "3",
    date: "2024-08-05",
    vaccine: "Bordetella",
    nextDue: "2025-02-05",
    status: "due-soon",
  },
]

const vaccinePackage = {
  name: "5-Shot Vaccination Package",
  totalShots: 5,
  completedShots: 3,
  remaining: ["Leptospirosis", "Lyme Disease"],
  nextScheduled: "2025-01-15",
}

export function MedicalRecords() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Medical History
          </TabsTrigger>
          <TabsTrigger value="vaccines" className="gap-2">
            <Syringe className="h-4 w-4" />
            Vaccinations
          </TabsTrigger>
          <TabsTrigger value="package" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Vaccine Package
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {medicalHistory.map((record, index) => (
                  <AccordionItem key={record.id} value={record.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{record.diagnosis}</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(record.date).toLocaleDateString()} • {record.doctor}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-14 space-y-3 border-l-2 border-border pl-6">
                        <div>
                          <p className="mb-1 font-medium text-sm">Symptoms:</p>
                          <p className="text-muted-foreground text-sm">{record.symptoms}</p>
                        </div>
                        <div>
                          <p className="mb-1 font-medium text-sm">Prescription:</p>
                          <p className="text-muted-foreground text-sm">{record.prescription}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vaccinationHistory.map((vaccine) => (
                  <div key={vaccine.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          vaccine.status === "completed" ? "bg-success/10" : "bg-warning/10"
                        }`}
                      >
                        <Syringe
                          className={`h-5 w-5 ${vaccine.status === "completed" ? "text-success" : "text-warning"}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{vaccine.vaccine}</p>
                        <p className="text-muted-foreground text-sm">
                          Given: {new Date(vaccine.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {vaccine.status === "completed" ? (
                        <Badge variant="outline" className="border-success text-success">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-warning text-warning">
                          <Clock className="mr-1 h-3 w-3" />
                          Due Soon
                        </Badge>
                      )}
                      <p className="mt-1 text-muted-foreground text-xs">
                        Next: {new Date(vaccine.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="package" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{vaccinePackage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">Progress</span>
                  <span className="text-muted-foreground text-sm">
                    {vaccinePackage.completedShots} of {vaccinePackage.totalShots} completed
                  </span>
                </div>
                <Progress value={(vaccinePackage.completedShots / vaccinePackage.totalShots) * 100} className="h-3" />
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-3 font-semibold text-sm">Remaining Vaccines</h4>
                <ul className="space-y-2">
                  {vaccinePackage.remaining.map((vaccine, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {vaccine}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Next Scheduled Shot</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(vaccinePackage.nextScheduled).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
