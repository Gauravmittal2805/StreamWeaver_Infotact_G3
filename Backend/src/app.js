const express = require("express");
const jobRoutes = require("./routes/job.routes");
const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/files", fileRoutes);

module.exports = app;
