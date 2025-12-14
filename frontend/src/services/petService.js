// Mock Pet Service
// Simulates backend API calls for pet management

const MOCK_PETS = [
  {
    id: 1,
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    weight: 30,
    ownerId: 1,
    image: "/golden-retriever.png",
    medicalHistory: [
      {
        date: "2024-01-15",
        type: "Checkup",
        notes: "Healthy, all vitals normal",
      },
      {
        date: "2024-02-20",
        type: "Vaccination",
        notes: "Rabies vaccination administered",
      },
    ],
    vaccinations: [
      { name: "Rabies", date: "2024-02-20", nextDue: "2025-02-20" },
      { name: "DHPP", date: "2023-12-10", nextDue: "2024-12-10" },
    ],
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Female",
    weight: 4,
    ownerId: 1,
    image: "/fluffy-persian-cat.png",
    medicalHistory: [
      {
        date: "2024-01-10",
        type: "Checkup",
        notes: "Slight dental plaque, recommended cleaning",
      },
    ],
    vaccinations: [
      { name: "FVRCP", date: "2024-01-05", nextDue: "2025-01-05" },
    ],
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const petService = {
  // Get all pets for a user
  getPets: async (ownerId) => {
    await delay(500);
    return MOCK_PETS.filter((pet) => pet.ownerId === ownerId);
  },

  // Get single pet details
  getPetDetails: async (petId) => {
    await delay(400);
    const pet = MOCK_PETS.find((p) => p.id === Number.parseInt(petId));
    if (!pet) {
      throw new Error("Pet not found");
    }
    return pet;
  },

  // Add new pet
  addPet: async (petData) => {
    await delay(600);
    const newPet = {
      id: MOCK_PETS.length + 1,
      ...petData,
      medicalHistory: [],
      vaccinations: [],
      image:
        petData.species === "Dog"
          ? "/golden-retriever.png"
          : "/fluffy-persian-cat.png",
    };
    MOCK_PETS.push(newPet);
    return newPet;
  },

  // Update pet
  updatePet: async (petId, updates) => {
    await delay(500);
    const index = MOCK_PETS.findIndex((p) => p.id === Number.parseInt(petId));
    if (index === -1) {
      throw new Error("Pet not found");
    }
    MOCK_PETS[index] = { ...MOCK_PETS[index], ...updates };
    return MOCK_PETS[index];
  },

  // Search pets (for doctor portal)
  searchPets: async (query) => {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return MOCK_PETS.filter(
      (pet) =>
        pet.name.toLowerCase().includes(lowerQuery) ||
        pet.breed.toLowerCase().includes(lowerQuery)
    );
  },

  // Create pet for pet registration
  createPet: async (petData) => {
    await delay(600);
    const newPet = {
      id: MOCK_PETS.length + 1,
      ...petData,
      ownerId: 1, // Mock owner ID
      medicalHistory: [],
      vaccinations: [],
      image:
        petData.species === "dog"
          ? "/golden-retriever.png"
          : "/fluffy-persian-cat.png",
    };
    MOCK_PETS.push(newPet);
    return newPet;
  },

  // Delete pet
  deletePet: async (petId) => {
    await delay(400);
    const index = MOCK_PETS.findIndex((p) => p.id === Number.parseInt(petId));
    if (index === -1) {
      throw new Error("Pet not found");
    }
    MOCK_PETS.splice(index, 1);
    return { success: true };
  },
};
