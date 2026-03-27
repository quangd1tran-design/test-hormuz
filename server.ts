import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Mock maritime data generation
const ORIGINS = ['SAUDI ARABIA', 'UAE', 'IRAQ', 'KUWAIT', 'QATAR', 'OMAN', 'USA', 'GERMANY', 'LIBERIA'];
const DESTINATIONS = ['FUJAIRAH', 'JEBEL ALI', 'BANDAR ABBAS', 'MUSCAT', 'DOHA', 'SINGAPORE', 'ROTTERDAM'];
const VESSEL_NAMES = [
  'MARINER-7', 'SILVER GLORY', 'NEPTUNE GHOST', 'GLOBAL TRADE', 'SHILOH', 'ARABIAN STAR',
  'OCEAN VOYAGER', 'DESERT ROSE', 'GULF SPIRIT', 'HORIZON', 'ECLIPSE', 'TITAN'
];

interface Vessel {
  id: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  speed: number;
  heading: number;
  lat: number;
  lng: number;
  imo: string;
  mmsi: string;
  status: string;
}

function generateInitialVessels(): Vessel[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `v-${i}`,
    name: `${i % 2 === 0 ? 'M/T' : 'C/V'} ${VESSEL_NAMES[i % VESSEL_NAMES.length]}`,
    type: (['OIL TANKER', 'GAS', 'CARGO', 'RECREATIONAL', 'NAVY'][i % 5]),
    origin: ORIGINS[i % ORIGINS.length],
    destination: DESTINATIONS[i % DESTINATIONS.length],
    speed: parseFloat((Math.random() * 20 + 5).toFixed(1)),
    heading: Math.floor(Math.random() * 360),
    lat: 26.5 + (Math.random() - 0.5) * 0.5,
    lng: 56.4 + (Math.random() - 0.5) * 0.5,
    imo: Math.floor(1000000 + Math.random() * 9000000).toString(),
    mmsi: Math.floor(100000000 + Math.random() * 900000000).toString(),
    status: (['CRUISING', 'AT ANCHOR', 'RESTRICTED_MAN', 'REFUELING', 'ON STATION'][i % 5]),
  }));
}

let vessels = generateInitialVessels();

// Update vessel positions periodically on the server
setInterval(() => {
  vessels = vessels.map(v => {
    if (v.status === 'AT ANCHOR' || v.status === 'REFUELING') return v;
    const rad = (v.heading * Math.PI) / 180;
    const moveLat = Math.cos(rad) * (v.speed / 10000);
    const moveLng = Math.sin(rad) * (v.speed / 10000);
    return {
      ...v,
      lat: v.lat + moveLat,
      lng: v.lng + moveLng,
    };
  });
}, 1000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Hostinger and other providers often use process.env.PORT
  const PORT = Number(process.env.PORT) || 3000;

  // Ensure NODE_ENV is handled if not set by the environment
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.resolve(process.cwd(), 'dist'));

  console.log(`[SERVER] Starting...`);
  console.log(`[SERVER] Mode: ${isProduction ? 'production' : 'development'}`);
  console.log(`[SERVER] Port: ${PORT}`);
  console.log(`[SERVER] CWD: ${process.cwd()}`);

  // API Routes
  app.get("/api/vessels", (req, res) => {
    res.json(vessels);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), mode: isProduction ? 'production' : 'development' });
  });

  // Vite middleware for development
  if (!isProduction) {
    console.log("[SERVER] Initializing Vite middleware (Development)...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("[SERVER] Failed to load Vite. Falling back to static serving.");
      serveStatic(app);
    }
  } else {
    serveStatic(app);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Listening on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error(`[SERVER] Server error: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
      console.error(`[SERVER] Port ${PORT} is already in use.`);
    }
  });
}

function serveStatic(app: express.Express) {
  // Try multiple common path resolutions for the 'dist' folder
  const possiblePaths = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '..', 'dist'),
    path.resolve(__dirname, 'dist')
  ];

  let distPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
      distPath = p;
      break;
    }
  }

  if (distPath) {
    console.log(`[SERVER] Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.error("[SERVER] ERROR: Could not find 'dist' directory with 'index.html'.");
    console.error("[SERVER] Searched in:", possiblePaths);
    app.get('*', (req, res) => {
      res.status(404).send("Frontend build not found. Please run 'npm run build' and ensure 'dist' exists.");
    });
  }
}

startServer();
