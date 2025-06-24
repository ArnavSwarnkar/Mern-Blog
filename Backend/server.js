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

// ✅ Updated CORS config for dev & production Vercel domains
const allowedOrigins = [
  "https://mern-blog-eta-flax.vercel.app",
  "https://mern-blog-9t2ak9cwl-arnav-swarnkars-projects.vercel.app", // example preview
  "http://localhost:3000", // optional for local testing
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false // you're using Authorization headers, not cookies
}));

app.use(express.json());
app.use("/", IndexRoute);
app.use(customErrorHandler);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} : ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});
