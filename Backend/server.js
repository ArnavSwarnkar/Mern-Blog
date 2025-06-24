// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");

// const IndexRoute = require("./Routers/index");
// const connectDatabase = require("./Helpers/database/connectDatabase");
// const customErrorHandler = require("./Middlewares/Errors/customErrorHandler");

// dotenv.config({ path: "./Config/config.env" });

// connectDatabase();

// const app = express();

// // ✅ Updated CORS config for dev & production Vercel domains
// const allowedOrigins = [
//   "https://mern-blog-eta-flax.vercel.app",
//   "https://mern-blog-9t2ak9cwl-arnav-swarnkars-projects.vercel.app", // example preview
//   "http://localhost:3000", // optional for local testing
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: false // you're using Authorization headers, not cookies
// }));

// app.use(express.json());
// app.use("/", IndexRoute);
// app.use(customErrorHandler);

// const PORT = process.env.PORT || 5000;

// app.use(express.static(path.join(__dirname, "public")));

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} : ${process.env.NODE_ENV}`);
// });

// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Logged Error : ${err}`);
//   server.close(() => process.exit(1));
// });


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const IndexRoute = require("./Routers/index");
const connectDatabase = require("./Helpers/database/connectDatabase");
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler");

dotenv.config({ path: "./Config/config.env" });

connectDatabase();

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://mern-blog-eta-flax.vercel.app",
  "https://mern-blog-9t2ak9cwl-arnav-swarnkars-projects.vercel.app",
  /^https:\/\/mern-blog-.*\.vercel\.app$/,
  "http://localhost:3000",
  "http://localhost:3001"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));

// Serve static files BEFORE routes
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use("/", IndexRoute);

// Error handling middleware
app.use(customErrorHandler);

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} : ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err}`);
  server.close(() => process.exit(1));
});
