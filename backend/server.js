import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connect_db } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import notesRoutes from "./routes/notes.route.js";
import healthRoutes from "./routes/health.route.js";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://notesapp0-41mg.onrender.com",
    "https://notesapp-jwro.onrender.com/",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
}));

 
app.use("/api/user/", userRoutes);
app.use("/api/notes/", notesRoutes);
app.use("/api/health/", healthRoutes);


const PORT = process.env.PORT || 5000
let frontendDistPath = path.join(__dirname, "..", "frontend", "dist");

// Fallbacks for different deployment layouts
if (!fs.existsSync(frontendDistPath)) {
    const alt1 = path.join(process.cwd(), "frontend", "dist");
    const alt2 = path.join(process.cwd(), "dist");
    if (fs.existsSync(alt1)) frontendDistPath = alt1;
    else if (fs.existsSync(alt2)) frontendDistPath = alt2;
}

if (process.env.NODE_ENV === "production") {
    if (fs.existsSync(frontendDistPath)) {
        app.use(express.static(frontendDistPath));

        app.get("*", (req, res) => {
            res.sendFile(path.join(frontendDistPath, "index.html"));
        });
        console.log(`Serving static files from ${frontendDistPath}`);
    } else {
        console.warn("Warning: frontend dist not found at expected paths. Static assets won't be served.");
    }
}

await connect_db();

app.listen(PORT,()=>{
    console.log("Server started at http://localhost:" + PORT); 
});
 
