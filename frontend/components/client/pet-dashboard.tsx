"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Dog, Cat } from "lucide-react"

const mockPets = [
  {
    mathucung: "1",
    ten: "Max",
    loai: "Dog",
    giong: "Golden Retriever",
    gender: "Male",
    ngaysinh: "2020-05-15",
    avatar: "/golden-retriever.png",
  },
  {
    mathucung: "2",
    ten: "Luna",
    loai: "Cat",
    giong: "Persian",
    gender: "Female",
    ngaysinh: "2021-08-22",
    avatar: "/fluffy-persian-cat.png",
  },
  {
    mathucung: "3",
    ten: "Charlie",
    loai: "Dog",
    giong: "Beagle",
    gender: "Male",
    ngaysinh: "2019-03-10",
    avatar: "/beagle-dog.png",
  },
]

export function PetDashboard() {
  const [pets] = useState(mockPets)
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl text-foreground">Your Pets</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Pet</DialogTitle>
              <DialogDescription>
                Add your pet's information to get started with their healthcare management
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pet-name">Pet Name</Label>
                <Input id="pet-name" placeholder="Enter pet name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <Select>
                  <SelectTrigger id="species">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" placeholder="Enter breed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input id="birthdate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Pet Photo (Optional)</Label>
                <Input id="avatar" type="file" accept="image/*" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Register Pet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Card key={pet.mathucung} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={pet.avatar || "/placeholder.svg"} alt={pet.ten} />
                  <AvatarFallback>
                    {pet.loai === "Dog" ? <Dog className="h-8 w-8" /> : <Cat className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{pet.ten}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {pet.giong} • {pet.loai}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{pet.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Born:</span>
                  <span className="font-medium">{new Date(pet.ngaysinh).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full bg-transparent">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
