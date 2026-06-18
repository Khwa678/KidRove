import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

// Setup express application
const app = express();
const PORT = 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage fallback configuration
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

// Ensure data directory and file exist for fallback storage
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}

// Global reference for MongoDB status
let isMongoConnected = false;

// Safe, resilient MongoDB Connection setup
const mongoUri = process.env.MONGO_URI;

let EnquiryModel = null;

if (mongoUri) {
  console.log("Connecting to MongoDB...");
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("✓ MongoDB Connected successfully");
      isMongoConnected = true;

      const EnquirySchema = new mongoose.Schema({
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      });

      EnquirySchema.virtual("id").get(function () {
        return this._id.toHexString();
      });
      EnquirySchema.set("toJSON", { virtuals: true });

      EnquiryModel = mongoose.model("Enquiry", EnquirySchema);
    })
    .catch((err) => {
      console.error("✗ MongoDB connection failed. Falling back to local storage.", err.message);
      isMongoConnected = false;
    });
} else {
  console.log("ℹ No MONGO_URI provided in environment. Utilizing local JSON file persistence.");
}

// Helpers for read/write on local storage backup
function getLocalEnquiries() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveLocalEnquiry(enquiry) {
  const enquiries = getLocalEnquiries();
  const newEnquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...enquiry,
    createdAt: new Date().toISOString(),
  };
  enquiries.push(newEnquiry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2), "utf-8");
  return newEnquiry;
}

// API ROUTE: Get server/database health and status info
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    time: new Date().toISOString(),
    database: isMongoConnected ? "MongoDB" : "Local JSON File Cache",
    enquiriesCount: isMongoConnected ? "fetching..." : getLocalEnquiries().length,
  });
});

// API ROUTE: Interactive AI Chatbot Endpoint (integrates with @google/genai)
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Validation error: 'message' is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("ℹ GEMINI_API_KEY is not defined. Responding via professional chatbot simulator.");
      return res.json({
        success: true,
        text: "🤖 **[AdvisorBot - Simulated Response]**\n\nWelcome to Kidrove AI & Robotics Summer Camp portal! My real-time Gemini brain is offline because the server lacks the `GEMINI_API_KEY`. Please prompt your host to add it under **Settings > Secrets**.\n\nHowever, list your camp questions and I can guide you! We cover:\n- **Week 1**: Microcontroller basics and Breadboard wiring.\n- **Week 2**: Ultrasonic obstacle-avoidance logic.\n- **Week 3**: Neural command networks (Vocal controls).\n- **Week 4**: Web dashboard cloud telemetry streaming.\n\nLet me know how I can help you enroll or navigate our RoboLabs simulator! 🚀"
      });
    }

    // Initialize clean GoogleGenAI instance with telemetry headers
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are RoboAdvisor, the friendly, creative, and highly intelligent AI mascot and educational guide for the Kidrove AI & Robotics Summer Camp. Your goal is to guide prospective students (ages 8-14) and parents about our 4-week camp. Be encouraging, use cool robot emojis (🤖, ⚡, ⚙️, 🚀), and provide brief, informative answers about the modules: Week 1 (Foundations), Week 2 (Sensors), Week 3 (Speech networks), and Week 4 (IoT cloud telemetry). Keep responses concise, clear, and highly engaging! Prefer simple markdown lists.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role && msg.text) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }]
    });

    let resolvedText = "";
    try {
      // Retry cascade with multiple robust models
      const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro"];
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`🤖 Attempting chatbot query using model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response && response.text) {
            resolvedText = response.text;
            break;
          }
        } catch (mErr) {
          lastError = mErr;
          console.warn(`⚠️ Chatbot model ${modelName} returned error: ${mErr.message || mErr}`);
        }
      }

      if (!resolvedText) {
        throw lastError || new Error("All cascade models returned empty response.");
      }

    } catch (apiError) {
      console.warn("❌ All active Gemini API calls failed. Initiating high-availability local knowledge fallback...", apiError.message);
      
      const promptLower = message.toLowerCase();
      let fallbackText = "🤖 **[Sensory Backup Mode Activated]**\n\n*Note: Our cloud-hosted Gemini model is experiencing temporary peak traffic (503 Service Unavailable). I have activated my localized emergency memory banks to assist you immediately!* ⚡\n\n";

      if (promptLower.includes("curriculum") || promptLower.includes("week") || promptLower.includes("topic") || promptLower.includes("learn") || promptLower.includes("syllabus") || promptLower.includes("outline")) {
        fallbackText += "Here is our comprehensive **4-Week Artificial Intelligence & Robotics Curriculum**:\n\n" +
          "- **Week 1: Foundations of Microcontrollers & IDE**: Breadboard schematics, loop constructs, flashing SOS codes.\n" +
          "- **Week 2: Sensory Networks & Navigation**: Ultrasonic sonar wave calculations, automated obstacle avoiding paths.\n" +
          "- **Week 3: Neural Classification Networks**: Voice vocal command activation paths ('Forward', 'Halt') to pilot TrapperBot without a keyboard!\n" +
          "- **Week 4: IoT & Real-Time Cloud Telemetry**: Real-time Express backend stream logging, dynamic React dashboard meters.\n\n" +
          "Would you like to book a slot for your child today?";
      } else if (promptLower.includes("cost") || promptLower.includes("price") || promptLower.includes("fee") || promptLower.includes("pay") || promptLower.includes("enroll")) {
        fallbackText += "Our full 4-week hybrid camp is priced at **$499 USD** (standard rate $650).\n\n" +
          "This all-inclusive package includes:\n" +
          "1. 4 extensive modules of hybrid live/recorded expert mentor training.\n" +
          "2. The physical **RoboBuddy Companion Hardware Kit** shipped directly to your house.\n" +
          "3. Lifetime access to the online RoboLabs IDE Simulator sandbox.\n" +
          "4. An accredited **Kidrove Young Robotics Engineer** graduation certificate & verified digital badge!\n\n" +
          "You can secure a seat easily using our **Enroll Slots** form!";
      } else if (promptLower.includes("kit") || promptLower.includes("hardware") || promptLower.includes("parts") || promptLower.includes("sensor") || promptLower.includes("arduino") || promptLower.includes("mcu") || promptLower.includes("material")) {
        fallbackText += "Our custom **RoboBuddy Companion Kit** is pre-packaged and shipped to all students at no extra charge! It features:\n\n" +
          "- **Microcontroller MCU Board**: Direct USB plug-and-play development board.\n" +
          "- **Ultrasonic distance calculation telemeters**: Double-transducer sonar sensor module for navigating path layouts.\n" +
          "- **Rotational Actuator Servos**: Precision stepper traction motors.\n" +
          "- **Wi-Fi node processor**: Streams real-time diagnostic indicators directly to our web portal.\n" +
          "- **Electronics grab-pack**: Premium breadboard, multicolor jumper connection wires, and LEDs.\n\n" +
          "Check out the **Curriculum Syllabus** page for kit pictures!";
      } else if (promptLower.includes("cert") || promptLower.includes("badge") || promptLower.includes("graduat") || promptLower.includes("credit") || promptLower.includes("credential")) {
        fallbackText += "Yes! Upon successfully completing the four week challenge files on the Kidrove portal:\n\n" +
          "- Your family receives our accredited **Kidrove Certified Young AI & Robotics Engineer** digital badge.\n" +
          "- Student profiles display a premium verifiable seal with custom level metrics.\n" +
          "- This portfolio-ready certificate is an outstanding showcase for university or STEM admissions! 🏅";
      } else if (promptLower.includes("age") || promptLower.includes("kid") || promptLower.includes("child") || promptLower.includes("year") || promptLower.includes("old")) {
        fallbackText += "The Kidrove camp is designed specifically for students **aged 8 to 14**.\n\n" +
          "Our platforms scale dynamically: younger students (8-11) utilize visual block guidance and pre-coded firmware paths, while older students (12-14) can write original JavaScript, Python, or microcomputer registers directly inside our online **RoboLabs Playground**! ⚙/🤖";
      } else if (promptLower.includes("simulator") || promptLower.includes("play") || promptLower.includes("playground") || promptLower.includes("sandbox") || promptLower.includes("robolabs") || promptLower.includes("bot")) {
        fallbackText += "You should check out our **RoboLabs Playground** tab! In this interactive coding simulator, you can:\n\n" +
          "1. Configure your virtual **TrapperBot-007** (custom colors, radar antenna selection).\n" +
          "2. Send micro-instruction commands like `PING_RANGE()`, `ROTATE_CLOCKWISE()`, or `TOGGLE_LED()`.\n" +
          "3. View dynamic logic terminal logs and run frequency responses.\n\n" +
          "Creating a parent portal account lets children save their custom bot specs permanently on the database server!";
      } else {
        fallbackText += "I am ready to assist you! Although our cloud service is experiencing temporary peak demand, I can easily guide you with these topics:\n\n" +
          "1. 📚 **Curriculum**: Detailed week-by-week program objectives.\n" +
          "2. 🛠️ **Companion Kit**: Hardware parts shipped to your shipping address.\n" +
          "3. 💰 **Enrollment Cost**: Pricing indices, certificate details, and early bird discounts.\n" +
          "4. 🚀 **RoboLabs Playground**: Learn about our 100% interactive online sandbox.\n\n" +
          "What would you like to explore next? Feel free to ask a prompt mentioning any of these keywords! 🤖⚡";
      }

      resolvedText = fallbackText;
    }

    return res.json({
      success: true,
      text: resolvedText
    });

  } catch (err) {
    console.error("Gemini AdvisorBot Handler Error:", err);
    return res.status(500).json({
      success: false,
      message: "Our chatbot server encountered an issue with Gemini.",
      error: err.message
    });
  }
});

// API ROUTE: Get all registered enquiries (for admin table visualization and dashboard utility)
app.get("/api/enquiries", async (req, res) => {
  try {
    if (isMongoConnected && EnquiryModel) {
      const dbEntries = await EnquiryModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: dbEntries.length, data: dbEntries });
    } else {
      const localEntries = getLocalEnquiries();
      // Sort descending by local timestamp
      const sorted = [...localEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ success: true, count: sorted.length, data: sorted });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error reading registrations.",
      error: err.message,
    });
  }
});

// API ROUTE: Register an enquiry (POST /api/enquiry)
app.post("/api/enquiry", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // 1. Validation for required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'name' is required and must be a valid string.",
      });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'email' is required.",
      });
    }

    // Basic email regex checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Please provide a valid email address.",
      });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'phone' is required.",
      });
    }

    // Standard phone check (digits, spaces, hyphens, optional + prefix, length 7-15)
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Please provide a valid telephone/mobile number.",
      });
    }

    // Prepare clean data
    const enquiryPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    let savedData;

    // 2. Persist using active driver
    if (isMongoConnected && EnquiryModel) {
      const mongoRecord = new EnquiryModel(enquiryPayload);
      savedData = await mongoRecord.save();
    } else {
      savedData = saveLocalEnquiry(enquiryPayload);
    }

    // 3. Return elegant success response with correct status code
    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully! We will contact you soon.",
      data: savedData,
    });

  } catch (err) {
    console.error("Error creating enquiry:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to process and record the enquiry.",
      error: err.message,
    });
  }
});

// USERS AUTH STORAGE STAMP
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Pre-create dynamic users file with default dashboard account
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(
      [
        {
          id: "usr_admin",
          name: "Academic Admin",
          email: "admin@kidrove.com",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString()
        }
      ],
      null,
      2
    ),
    "utf-8"
  );
}

function getLocalUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveLocalUser(user) {
  const users = getLocalUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return user;
}

function updateLocalUser(userId, updatedFields) {
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedFields };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    return true;
  }
  return false;
}

// Global user count helper for registration
let userModelReference = null; // Stays local for consistency

// ENDPOINTS //
// 1. SIGNUP API
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Name, email, and password are required."
      });
    }

    const cleanedEmail = email.trim().toLowerCase();
    const users = getLocalUsers();
    
    if (users.find(u => u.email === cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Ineligible registration: A user already exists with this email address."
      });
    }

    // New RoboBuddy dynamic profile seed
    const initialRoboBuddy = {
      name: "BuddyBot",
      color: "#6366f1",
      eyeColor: "#10b981",
      antennaType: "basic",
      powerCore: "amber",
      commandsRunCount: 0,
      level: 1,
      exp: 0
    };

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      email: cleanedEmail,
      password: password, // simple storage
      role: "parent",
      roboBuddy: initialRoboBuddy,
      createdAt: new Date().toISOString()
    };

    saveLocalUser(newUser);

    // Return without raw password
    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      message: "Parent/Student account registered successfully! Dynamic workspace active.",
      user: userSafe
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server registry breakdown.",
      error: err.message
    });
  }
});

// 2. LOGIN API
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Email and password are required."
      });
    }

    const cleanedEmail = email.trim().toLowerCase();
    const users = getLocalUsers();
    const user = users.find(u => u.email === cleanedEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Invalid email address or secure password."
      });
    }

    const { password: _, ...userSafe } = user;
    return res.json({
      success: true,
      message: "Authentication successful! Portal loaded.",
      user: userSafe
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server auth breakdown.",
      error: err.message
    });
  }
});

// 3. UPDATE ROBOBUDDY STATE API
app.post("/api/auth/robobuddy", (req, res) => {
  try {
    const { userId, roboBuddy } = req.body;

    if (!userId || !roboBuddy) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: User ID and RoboBuddy parameters are required."
      });
    }

    const users = getLocalUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Profile not located."
      });
    }

    // Merge/overwrite RoboBuddy state
    const updatedBuddy = { ...user.roboBuddy, ...roboBuddy };
    const success = updateLocalUser(userId, { roboBuddy: updatedBuddy });

    if (success) {
      return res.json({
        success: true,
        message: "RoboBuddy customized and calibrated successfully!",
        roboBuddy: updatedBuddy
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to update target configurations."
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal configuration server error.",
      error: err.message
    });
  }
});

// 4. ADMIN ACTIONS: DELETE ENQUIRY/REGISTRATION
app.post("/api/auth/delete-enquiry", async (req, res) => {
  try {
    const { enquiryId } = req.body;

    if (!enquiryId) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Registration Enquiry ID is required."
      });
    }

    if (isMongoConnected && EnquiryModel) {
      await EnquiryModel.findByIdAndDelete(enquiryId);
      return res.json({ success: true, message: "Enquiry successfully deleted from database." });
    } else {
      const enquiries = getLocalEnquiries();
      const updatedEnquiries = enquiries.filter(e => e.id !== enquiryId);
      fs.writeFileSync(DATA_FILE, JSON.stringify(updatedEnquiries, null, 2), "utf-8");
      return res.json({ success: true, message: "Enquiry successfully deleted from local file cache." });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete target document.",
      error: err.message
    });
  }
});


// Vite middleware flow for full-stack SPA serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production: serve built static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static distribution directory loaded for production.");
  }

  // Final fallback to bind
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
