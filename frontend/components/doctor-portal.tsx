"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  User,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockPatients = [
  {
    id: "PET001",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    owner: "John Smith",
    ownerPhone: "+1 (555) 123-4567",
    birthdate: "2020-05-15",
    allergies: ["Penicillin"],
    lastVisit: "2024-12-01",
    avatar: "/golden-retriever.png",
    medicalHistory: [
      {
        date: "2024-12-01",
        diagnosis: "Annual Health Checkup",
        doctor: "Dr. Sarah Johnson",
      },
      {
        date: "2024-09-15",
        diagnosis: "Skin Allergy",
        doctor: "Dr. Michael Chen",
      },
    ],
  },
  {
    id: "PET002",
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    owner: "Emily Johnson",
    ownerPhone: "+1 (555) 234-5678",
    birthdate: "2021-08-22",
    allergies: [],
    lastVisit: "2024-11-28",
    avatar: "/fluffy-persian-cat.png",
    medicalHistory: [
      {
        date: "2024-11-28",
        diagnosis: "Routine Vaccination",
        doctor: "Dr. Sarah Johnson",
      },
    ],
  },
];

const mockMedicines = [
  { id: "1", name: "Amoxicillin", stock: 45, unit: "tablets" },
  { id: "2", name: "Cephalexin", stock: 32, unit: "capsules" },
  { id: "3", name: "Prednisone", stock: 28, unit: "tablets" },
  { id: "4", name: "Metronidazole", stock: 19, unit: "tablets" },
  { id: "5", name: "Carprofen", stock: 56, unit: "tablets" },
  { id: "6", name: "Doxycycline", stock: 0, unit: "capsules" },
];

type Prescription = {
  id: string;
  medicine: string;
  quantity: number;
  instructions: string;
  stock: number;
};

export function DoctorPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof mockPatients)[0] | null
  >(null);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicineSearch, setMedicineSearch] = useState("");

  const handleSearch = () => {
    const found = mockPatients.find(
      (p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerPhone.includes(searchQuery)
    );
    setSelectedPatient(found || null);
    setSymptoms("");
    setDiagnosis("");
    setPrescriptions([]);
  };

  const addPrescription = () => {
    const newId = Date.now().toString();
    setPrescriptions([
      ...prescriptions,
      { id: newId, medicine: "", quantity: 1, instructions: "", stock: 0 },
    ]);
  };

  const updatePrescription = (
    id: string,
    field: keyof Prescription,
    value: string | number
  ) => {
    setPrescriptions(
      prescriptions.map((p) => {
        if (p.id === id) {
          if (field === "medicine") {
            const medicineValue = String(value);
            const med = mockMedicines.find((m) => m.name === medicineValue);
            return { ...p, [field]: medicineValue, stock: med?.stock || 0 };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const filteredMedicines = mockMedicines.filter((m) =>
    m.name.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl text-foreground">Doctor Portal</h2>
        <p className="text-muted-foreground">
          Patient consultations and prescriptions
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Lookup</CardTitle>
          <CardDescription>
            Search by Pet ID, Pet Name, or Owner Phone Number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Pet ID, name, or owner phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Patient Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={selectedPatient.avatar || "/placeholder.svg"}
                      alt={selectedPatient.name}
                    />
                    <AvatarFallback>{selectedPatient.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl">
                        {selectedPatient.name}
                      </h3>
                      <Badge variant="outline">{selectedPatient.id}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {selectedPatient.breed} • {selectedPatient.species}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{selectedPatient.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {selectedPatient.ownerPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Birthdate:</span>
                    <span className="font-medium">
                      {new Date(selectedPatient.birthdate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedPatient.allergies.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-muted-foreground">Allergies:</span>
                      <div className="flex gap-1">
                        {selectedPatient.allergies.map((allergy) => (
                          <Badge key={allergy} variant="destructive">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-semibold text-sm">
                    Recent Medical History
                  </h4>
                  <div className="space-y-2">
                    {selectedPatient.medicalHistory.map((record, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-muted/50 p-3"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">
                            {record.diagnosis}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {record.doctor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Examination & Prescription */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Examination Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Clinical Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe observed symptoms..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Enter diagnosis..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Prescription</CardTitle>
                    <CardDescription>
                      Add medicines and usage instructions
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={addPrescription} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {prescriptions.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-border py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      No medicines added yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="space-y-2 rounded-lg border p-3"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="relative">
                              <Label className="text-xs">Medicine Name</Label>
                              <Input
                                placeholder="Search medicine..."
                                value={prescription.medicine}
                                onChange={(e) => {
                                  updatePrescription(
                                    prescription.id,
                                    "medicine",
                                    e.target.value
                                  );
                                  setMedicineSearch(e.target.value);
                                }}
                                list={`medicines-${prescription.id}`}
                              />
                              <datalist id={`medicines-${prescription.id}`}>
                                {filteredMedicines.map((med) => (
                                  <option key={med.id} value={med.name} />
                                ))}
                              </datalist>
                              {prescription.medicine && (
                                <div className="mt-1">
                                  {prescription.stock > 0 ? (
                                    <Badge
                                      variant="outline"
                                      className="border-success text-success text-xs"
                                    >
                                      Stock: {prescription.stock} available
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="border-destructive text-destructive text-xs"
                                    >
                                      Out of stock
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={prescription.quantity}
                                onChange={(e) =>
                                  updatePrescription(
                                    prescription.id,
                                    "quantity",
                                    Number.parseInt(e.target.value) || 1
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">
                                Usage Instructions
                              </Label>
                              <Input
                                placeholder="e.g., 1 tablet twice daily after meals"
                                value={prescription.instructions}
                                onChange={(e) =>
                                  updatePrescription(
                                    prescription.id,
                                    "instructions",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePrescription(prescription.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="mt-4 w-full" size="lg">
                  Save Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!selectedPatient && searchQuery && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No patient found. Try searching with a different query.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
