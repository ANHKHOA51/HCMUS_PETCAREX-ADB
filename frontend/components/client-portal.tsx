"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PetDashboard } from "@/components/client/pet-dashboard"
import { BookingWizard } from "@/components/client/booking-wizard"
import { MedicalRecords } from "@/components/client/medical-records"

export function ClientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {showRegister ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center">
              {showRegister ? "Register to manage your pet's healthcare" : "Sign in to your PETCAREX account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            {showRegister && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={() => setIsLoggedIn(true)} className="w-full">
              {showRegister ? "Create Account" : "Sign In"}
            </Button>
            <Button variant="link" onClick={() => setShowRegister(!showRegister)} className="w-full">
              {showRegister ? "Already have an account? Sign in" : "Need an account? Register"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl text-foreground">Client Portal</h2>
        <p className="text-muted-foreground">Manage your pets and appointments</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">My Pets</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PetDashboard />
        </TabsContent>

        <TabsContent value="booking">
          <BookingWizard />
        </TabsContent>

        <TabsContent value="records">
          <MedicalRecords />
        </TabsContent>
      </Tabs>
    </div>
  )
}
