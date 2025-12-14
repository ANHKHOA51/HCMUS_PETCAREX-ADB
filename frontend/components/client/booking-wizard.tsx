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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const steps = [
  { id: 1, name: "Branch", description: "Select clinic location" },
  { id: 2, name: "Service", description: "Choose service type" },
  { id: 3, name: "Pet", description: "Select your pet" },
  { id: 4, name: "Date & Time", description: "Pick appointment slot" },
  { id: 5, name: "Confirmation", description: "Review booking" },
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-colors ${
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary bg-background text-primary"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="font-medium text-xs">{step.name}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  currentStep > step.id ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>Select Branch Location</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a clinic location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown">
                    Downtown Veterinary Clinic
                  </SelectItem>
                  <SelectItem value="westside">
                    Westside Pet Hospital
                  </SelectItem>
                  <SelectItem value="suburban">
                    Suburban Animal Care Center
                  </SelectItem>
                  <SelectItem value="eastend">
                    East End Veterinary Services
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Select Service Type</Label>
              <div className="grid gap-3">
                <Card
                  className={`cursor-pointer transition-colors ${
                    selectedService === "examination"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedService("examination")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Medical Examination
                    </CardTitle>
                    <CardDescription>
                      General health checkup and consultation
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card
                  className={`cursor-pointer transition-colors ${
                    selectedService === "vaccination-single"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedService("vaccination-single")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Vaccination (Single)
                    </CardTitle>
                    <CardDescription>
                      Individual vaccine administration
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card
                  className={`cursor-pointer transition-colors ${
                    selectedService === "vaccination-package"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedService("vaccination-package")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Vaccination Package
                    </CardTitle>
                    <CardDescription>
                      Complete vaccination series (5 shots)
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Label>Select Pet</Label>
              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose which pet needs service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Max (Golden Retriever)</SelectItem>
                  <SelectItem value="luna">Luna (Persian Cat)</SelectItem>
                  <SelectItem value="charlie">Charlie (Beagle)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date: Date) => date < new Date()}
                />
              </div>
              {selectedDate && (
                <div>
                  <Label className="mb-3 block">Select Time Slot</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-4 font-semibold text-foreground">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-medium">
                      {selectedBranch === "downtown" &&
                        "Downtown Veterinary Clinic"}
                      {selectedBranch === "westside" && "Westside Pet Hospital"}
                      {selectedBranch === "suburban" &&
                        "Suburban Animal Care Center"}
                      {selectedBranch === "eastend" &&
                        "East End Veterinary Services"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">
                      {selectedService === "examination" &&
                        "Medical Examination"}
                      {selectedService === "vaccination-single" &&
                        "Vaccination (Single)"}
                      {selectedService === "vaccination-package" &&
                        "Vaccination Package"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pet:</span>
                    <span className="font-medium">
                      {selectedPet === "max" && "Max (Golden Retriever)"}
                      {selectedPet === "luna" && "Luna (Persian Cat)"}
                      {selectedPet === "charlie" && "Charlie (Beagle)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Confirm Booking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !selectedBranch) ||
              (currentStep === 2 && !selectedService) ||
              (currentStep === 3 && !selectedPet) ||
              (currentStep === 4 && (!selectedDate || !selectedTime))
            }
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
