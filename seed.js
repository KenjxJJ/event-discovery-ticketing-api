require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/event.model');
const Booking = require('./models/booking.model');
const connectDB = require('./database/connectDb');

const seedEvents = [
    {
        title: "Afro Tech Summit 2026",
        description: "Africa's largest technology and startup gathering featuring AI, fintech, and web innovations.",
        category: "Tech",
        city: "Lagos",
        venue: "Landmark Event Centre, Victoria Island",
        daysFromNow: 15,
        price: 15000,
        capacity: 350,
        status: "upcoming"
    },
    {
        title: "Lagos Jazz & Soul Nights",
        description: "An evening of live afro-jazz, soul, and contemporary fusion performances.",
        category: "Music",
        city: "Lagos",
        venue: "Terra Kulture, Victoria Island",
        daysFromNow: 18,
        price: 8000,
        capacity: 120,
        status: "upcoming"
    },
    {
        title: "East Africa Developers Conference",
        description: "Deep dive workshops into cloud-native architectures, distributed systems, and Go/Rust.",
        category: "Tech",
        city: "Nairobi",
        venue: "Sarit Expo Centre, Westlands",
        daysFromNow: 22,
        price: 6500,
        capacity: 250,
        status: "upcoming"
    },
    {
        title: "West African Art & Sculpture Biennale",
        description: "Exhibition showcasing modern and classical African sculptures, paintings, and digital artwork.",
        category: "Arts",
        city: "Accra",
        venue: "National Theatre of Ghana",
        daysFromNow: 25,
        price: 4500,
        capacity: 200,
        status: "upcoming"
    },
    {
        title: "Global Venture Capital & Angel Forum",
        description: "Connecting top African founders with global venture capital and private equity investors.",
        category: "Business",
        city: "Kigali",
        venue: "Kigali Convention Centre",
        daysFromNow: 28,
        price: 35000,
        capacity: 150,
        status: "upcoming"
    },
    {
        title: "Nairobi Marathon & Fitness Expo",
        description: "Annual half and full marathon competition with international runners and wellness brand exhibitions.",
        category: "Sports",
        city: "Nairobi",
        venue: "Nyayo National Stadium",
        daysFromNow: 30,
        price: 2500,
        capacity: 1000,
        status: "upcoming"
    },
    {
        title: "London Fintech Disruptors 2026",
        description: "Exploring decentralized finance, AI compliance, and cross-border digital payments.",
        category: "Business",
        city: "London",
        venue: "ExCeL London, Royal Victoria Dock",
        daysFromNow: 35,
        price: 45000,
        capacity: 400,
        status: "upcoming"
    },
    {
        title: "Berlin Underground Electronic Fest",
        description: "3-day immersive techno and electronic music experience featuring world-class DJs.",
        category: "Music",
        city: "Berlin",
        venue: "Kraftwerk Berlin",
        daysFromNow: 38,
        price: 18000,
        capacity: 600,
        status: "upcoming"
    },
    {
        title: "Modern UI/UX Design Workshop",
        description: "Hands-on masterclass in design systems, micro-interactions, and accessibility standards.",
        category: "Tech",
        city: "Lagos",
        venue: "Zone Tech Park, Gbagada",
        daysFromNow: 40,
        price: 12000,
        capacity: 60,
        status: "upcoming"
    },
    {
        title: "New York Premier Indie Film Showcase",
        description: "Screening of breakthrough international independent films followed by Q&A with directors.",
        category: "Arts",
        city: "New York",
        venue: "Tribeca Film Center, Manhattan",
        daysFromNow: 42,
        price: 22000,
        capacity: 180,
        status: "upcoming"
    },
    {
        title: "International 3x3 Streetball Championship",
        description: "Fast-paced urban basketball tournament featuring regional and national club champions.",
        category: "Sports",
        city: "Lagos",
        venue: "Teslim Balogun Stadium, Surulere",
        daysFromNow: 45,
        price: 3000,
        capacity: 500,
        status: "upcoming"
    },
    {
        title: "SaaS Growth & Product Leadership Summit",
        description: "Strategies for scaling B2B SaaS from $1M to $20M ARR, retention benchmarks, and PLG.",
        category: "Business",
        city: "London",
        venue: "The QEII Centre, Westminster",
        daysFromNow: 48,
        price: 50000,
        capacity: 220,
        status: "upcoming"
    },
    {
        title: "Afrobeats Summer Festival 2026",
        description: "Open air mega-concert featuring headline Afrobeat artists, dance troupes, and food trucks.",
        category: "Music",
        city: "Lagos",
        venue: "Eko Atlantic City Ground",
        daysFromNow: 50,
        price: 20000,
        capacity: 2000,
        status: "upcoming"
    },
    {
        title: "AI & Autonomous Systems Symposium",
        description: "Cutting-edge research discussions on generative AI, autonomous robotics, and safety alignment.",
        category: "Tech",
        city: "Berlin",
        venue: "Berlin Congress Center",
        daysFromNow: 55,
        price: 28000,
        capacity: 300,
        status: "upcoming"
    },
    {
        title: "Cape Town Contemporary Theater Gala",
        description: "Original stage drama highlighting poignant narratives of modern African heritage.",
        category: "Arts",
        city: "Cape Town",
        venue: "Artscape Theatre Centre",
        daysFromNow: 58,
        price: 9500,
        capacity: 240,
        status: "upcoming"
    },
    {
        title: "Global Supply Chain & Logistics Expo",
        description: "Innovations in automated warehousing, drone delivery, and maritime shipping logistics.",
        category: "Business",
        city: "Accra",
        venue: "Accra International Conference Centre",
        daysFromNow: 60,
        price: 14000,
        capacity: 180,
        status: "upcoming"
    },
    {
        title: "Rugby Sevens Invitational Cup",
        description: "High-octane rugby sevens competition between top clubs across Africa and Europe.",
        category: "Sports",
        city: "Nairobi",
        venue: "RFUEA Grounds, Ngong Road",
        daysFromNow: 62,
        price: 4000,
        capacity: 800,
        status: "upcoming"
    },
    {
        title: "Fullstack Web & Cloud Camp",
        description: "Intensive 2-day bootcamp covering React, Node.js, Docker, Kubernetes, and MongoDB.",
        category: "Tech",
        city: "Lagos",
        venue: "Coven Works Hub, Lekki Phase 1",
        daysFromNow: 65,
        price: 10000,
        capacity: 50,
        status: "upcoming"
    },
    {
        title: "Paris Haute Couture & Design Runway",
        description: "Exclusive preview of upcoming season collections from pioneering sustainable fashion houses.",
        category: "Arts",
        city: "Paris",
        venue: "Palais de Tokyo",
        daysFromNow: 70,
        price: 60000,
        capacity: 140,
        status: "upcoming"
    },
    {
        title: "Pan-African Classical Orchestra Tour",
        description: "Symphonic masterpiece combining Western classical instruments with authentic African percussions.",
        category: "Music",
        city: "Kigali",
        venue: "Camp Kigali Cultural Village",
        daysFromNow: 75,
        price: 11000,
        capacity: 220,
        status: "upcoming"
    },
    {
        title: "Cybersecurity & Zero-Trust Defense Forum",
        description: "Practical defensive architecture, threat hunting, and ransomware prevention for enterprises.",
        category: "Tech",
        city: "London",
        venue: "Business Design Centre, Islington",
        daysFromNow: 80,
        price: 32000,
        capacity: 200,
        status: "upcoming"
    },
    {
        title: "Junior Tennis Open Masters",
        description: "Championship tournament featuring rising junior tennis athletes competing on clay courts.",
        category: "Sports",
        city: "Lagos",
        venue: "Lagos Lawn Tennis Club, Onikan",
        daysFromNow: 85,
        price: 3500,
        capacity: 300,
        status: "upcoming"
    },
    {
        title: "AgriTech & Climate Solutions Conference",
        description: "Scaling solar irrigation, precision agriculture, and sustainable food supply chains.",
        category: "Business",
        city: "Nairobi",
        venue: "Kenyatta International Convention Centre (KICC)",
        daysFromNow: 90,
        price: 8500,
        capacity: 250,
        status: "upcoming"
    },
    {
        title: "Ceramic & Pottery Heritage Fair",
        description: "Live wheel throwing demonstrations, artisan ceramic stalls, and pottery masterclasses.",
        category: "Arts",
        city: "Lagos",
        venue: "Freedom Park, Lagos Island",
        daysFromNow: 95,
        price: 2000,
        capacity: 100,
        status: "upcoming"
    },
    {
        title: "Sunset Rooftop Acoustic Showcase",
        description: "Intimate acoustic sessions with indie singer-songwriters overlooking the city skyline.",
        category: "Music",
        city: "Nairobi",
        venue: "The Alchemist Bar, Parklands",
        daysFromNow: 100,
        price: 5000,
        capacity: 90,
        status: "upcoming"
    }
];

async function seedDatabase() {
    try {
        await connectDB();
        console.log("Connected to MongoDB. Seeding events...");

        // Remove previous test/seed events to keep collection clean
        await Event.deleteMany({});
        await Booking.deleteMany({});
        console.log("Cleared existing events and bookings.");

        const eventsToInsert = seedEvents.map(event => {
            const { daysFromNow, ...data } = event;
            return {
                ...data,
                date: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
                seatsBooked: 0
            };
        });

        const createdEvents = await Event.insertMany(eventsToInsert);
        console.log(`Successfully seeded ${createdEvents.length} events into the database!`);
        
        console.log("\nSample seeded events:");
        createdEvents.slice(0, 3).forEach((ev, idx) => {
            console.log(` ${idx + 1}. [${ev.category}] ${ev.title} in ${ev.city} (${ev.date.toISOString().split('T')[0]}) - Price: ${ev.price}, Capacity: ${ev.capacity}`);
        });

        await mongoose.connection.close();
        console.log("\nDatabase connection closed cleanly.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to seed database:", err);
        process.exit(1);
    }
}

seedDatabase();
