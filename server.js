const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const sequelize = require('./db.js');
const contactRoutes = require("./Routes/contactRoutes.js");
const TagRoutes = require("./Routes/TagRoutes.js");
const path = require('path');
const inquiryRoutes = require("./Routes/inquiryRoutes.js");
const ideaRoutes = require("./Routes/ideaRoutes.js");
const userRoutes = require("./Routes/userRoutes.js");
const DepartRoutes = require("./Routes/DepartRoutes.js");
const JobRoutes = require("./Routes/JobRoutes.js");
const serviceRoutes = require("./Routes/serviceRoutes.js");
const blogCatRoutes = require("./Routes/blogCatRoutes.js");
const blogRoutes = require("./Routes/blogRoutes.js");
const SubscribersRoutes = require("./Routes/SubscribersRoutes.js");
const { default: axios } = require("axios");
const initAssociations = require("./models/associations.js");
const app = express();
dotenv.config();
app.use(express.json());
initAssociations();

  app.use(cors({
    origin: "*", // Allow all origins (replace '*' with specific origins if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
app.use('/api', contactRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', ideaRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api', blogCatRoutes);
app.use("/api", blogRoutes);
app.use("/api", JobRoutes);
app.use("/api", TagRoutes);
app.use("/api", DepartRoutes);
app.use("/api", userRoutes);
app.use("/api", SubscribersRoutes);

const PORT = 5000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
(async () => {
  try {
    await sequelize.authenticate(); // Test the connection

    // Sync all models (optional: force=false avoids dropping existing tables)
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
})();
app.listen(PORT, () => console.log(`Server runningss on http://localhost:${PORT}`));