import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import compression from "compression";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";

// Load environment variables
dotenv.config();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Middlewares
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://hh-clocks-watches-production.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://hh-clocks-watches-production.up.railway.app",
          ...(isProduction ? [] : ["http://localhost:5000"]),
        ],
        imgSrc: ["'self'", "data:", "https://hh-clocks-watches-production.up.railway.app"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", "https://www.google.com", "https://www.google.com/maps", "https://maps.google.com"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
    crossOriginResourcePolicy: false,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Serve uploaded images from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const clientDistPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientDistPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});



// Start server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
