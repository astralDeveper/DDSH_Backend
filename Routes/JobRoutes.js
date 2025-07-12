const express = require("express");
const multer = require("multer");
const {
  createJob,
  addJobApp,
  deleteJob,
  getAllJobs,
  updateJob,
  getJobByIdFront,
  getJobById,
  addCareer
} = require("../controllers/jobController.js");

const upload = multer(); 

const router = express.Router();

router.post("/job", upload.none(), createJob);           
router.get("/jobs", getAllJobs);        
router.post("/add-career", addCareer);  
router.post("/add-jobapp", addJobApp);          
router.get("/job/:id", getJobById);       
router.get("/job-front/:id", getJobByIdFront);       
router.put("/job/:id", upload.none(), updateJob);        
router.delete("/job/:id", deleteJob);     

module.exports = router;
