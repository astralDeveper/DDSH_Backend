const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const sequelize = require('./db.js');
const contactRoutes = require("./Routes/contactRoutes.js");
const inquiryRoutes = require("./Routes/inquiryRoutes.js");
const ideaRoutes = require("./Routes/ideaRoutes.js");
const serviceRoutes = require("./Routes/serviceRoutes.js");
const { default: axios } = require("axios");
const app = express();
dotenv.config();
app.use(express.json());


  app.use(cors({
    origin: "*", // Allow all origins (replace '*' with specific origins if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
app.use('/api', contactRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', ideaRoutes);
app.use('/api/service', serviceRoutes);

const PORT = 5000;

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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));