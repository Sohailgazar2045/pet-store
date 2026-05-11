import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
console.log("DEBUG: MONGODB_URI in process.env:", process.env.MONGODB_URI)
import { connectDB } from "../lib/db"
import { Listing } from "../models/Listing"
import { User } from "../models/User"
import { hashPassword } from "../lib/auth"
import mongoose from "mongoose"

const DEMO_LISTINGS = [
  {
    title: "Elite Sahiwal Cow - High Yield",
    description: "Purebred Sahiwal cow, 2nd lactation, yielding 18-20 liters per day. Fully vaccinated and healthy. Perfect for commercial dairy farming.",
    price: 2450,
    category: "cattle",
    subcategory: "cow",
    breed: "Sahiwal",
    status: "active",
    views: 450,
    isFeatured: true,
    location: {
      city: "Lahore",
      state: "Punjab",
      country: "Pakistan"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800", public_id: "demo_1" }
    ],
    tags: ["dairy", "high-yield", "sahiwal"]
  },
  {
    title: "Purebred Golden Retriever Puppies",
    description: "Adorable Golden Retriever puppies, 8 weeks old. Champion bloodline, AKC registered, first shots and deworming completed.",
    price: 850,
    category: "pets",
    subcategory: "dog",
    breed: "Golden Retriever",
    status: "active",
    views: 1200,
    isFeatured: true,
    location: {
      city: "Islamabad",
      state: "ICT",
      country: "Pakistan"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800", public_id: "demo_2" }
    ],
    tags: ["puppy", "friendly", "purebred"]
  },
  {
    title: "Brahman Bull - Heavy Duty",
    description: "Massive Brahman Bull, 3 years old, ideal for breeding. Excellent weight and muscle structure. Disease-free certified.",
    price: 5500,
    category: "cattle",
    subcategory: "bull",
    breed: "Brahman",
    status: "active",
    views: 320,
    isFeatured: false,
    location: {
      city: "Multan",
      state: "Punjab",
      country: "Pakistan"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800", public_id: "demo_3" }
    ],
    tags: ["breeding", "bull", "heavy"]
  },
  {
    title: "Persian Kitten - Triple Coat",
    description: "Beautiful white Persian kitten, 10 weeks old. Extremely fluffy triple coat, doll face, very playful and litter trained.",
    price: 350,
    category: "pets",
    subcategory: "cat",
    breed: "Persian",
    status: "active",
    views: 850,
    isFeatured: false,
    location: {
      city: "Karachi",
      state: "Sindh",
      country: "Pakistan"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800", public_id: "demo_4" }
    ],
    tags: ["kitten", "fluffy", "persian"]
  }
]

async function seed() {
  try {
    await connectDB()
    console.log("Connected to MongoDB for seeding...")

    // Get a demo user to assign as seller
    let user = await User.findOne({ email: "demo@example.com" })
    if (!user) {
      user = await User.create({
        name: "Demo Seller",
        email: "demo@example.com",
        password: await hashPassword("password123"),
        role: "user"
      })
      console.log("Created demo seller user")
    }

    // Clear existing listings
    await Listing.deleteMany({ seller: user._id })
    console.log("Cleared existing demo listings")

    // Insert new listings
    const listingsWithSeller = DEMO_LISTINGS.map(l => ({
      ...l,
      seller: user!._id,
      createdAt: new Date()
    }))

    await Listing.insertMany(listingsWithSeller)
    console.log(`Successfully seeded ${DEMO_LISTINGS.length} listings!`)

    process.exit(0)
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

seed()
