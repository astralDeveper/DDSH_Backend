  const Job = require("../models/Job");
  const multer = require("multer");
  const nodemailer = require("nodemailer");
  const JobApp = require('../models/JobApp');
  const path = require("path");
  const Department = require("../models/Department");

  // const storage = JobStorage;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/jobs"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 },  // 1MB limit
    fileFilter: (req, file, cb) => {
      const fileTypes = /doc|pdf|jpg|png|jpeg/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);

      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
      }
    }
  }).single("resume");

  module.exports.addCareer = async (req, res) => {
    upload(req, res, async (err) => {
      const { name, phone, email, department } = req.body;
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ message: "Error: " + err.message });
      }

      if (!name) {
        return res.status(400).json({ message: "Name is required!" });
      }

      try {
        const updateData = { name, phone, email, department };
        const resume = req.file;
        if (resume.path) {
          updateData.resume = resume.path;
        }
        updateData.category = "career";

        const career = await JobApp.create(updateData);

        const departmentRecord = await Department.findByPk(department);
        if (!departmentRecord) {
          return res.status(404).json({ message: "Department not found" });
        }

        const departmentEmail = departmentRecord.email;

        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SERVERNAME,
            pass: process.env.PASSWORD,
          }
        });

        // Define email options
        const mailOptions = {
          from: 'info@quantumcubix.com', // Sender address
          to: departmentEmail, // Recipient (department email)
          subject: `New Job Application: ${name}`, // Email subject
          text: `A new job application has been submitted.\n\n
          Name: ${name}\n
          Phone: ${phone}\n
          Email: ${email}\n
          Department: ${departmentRecord.name}`,
          attachments: [
            {
              filename: resume?.originalname || 'resume', // Use original filename or a default name
              path: resume?.path, // Path to the uploaded file
            },
          ],
        };

        // Email to the User
        const userMailOptions = {
          from: departmentEmail, // Sender address
          to: email, // User's email
          subject: 'Your Job Application Submission', // Email subject
          text: `Dear ${name},\n\nThank you for applying to the ${departmentRecord.name} department.\nWe have received your application and will be in touch shortly.\n\nBest regards,\nTeam`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(userMailOptions);
        res.status(201).json({ message: "Career created successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error saving career " + error.message });
      }
    });
  };

  module.exports.createJob = async (req, res) => {
    const {
      title,
      location,
      skills,
      description: desc,
      responsb,
      type,
      department,
      deadline,
      designation,
      requir,
      status,
      email
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    // Process skills input
    let SkillsString = "";
    if (skills) {
      const SkillskeyArray = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim());
      SkillsString = SkillskeyArray.join(",");
    }

    const jobData = {
      title,
      location,
      description: desc,
      responsibilities: responsb,
      deadline,
      department,
      skills: SkillsString,
      designation,
      type,
      requirements: requir,
      status,
      email,
    };

    try {
      // Create the job using Sequelize's `create` method
      const job = await Job.create(jobData);
      res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
      console.error("Error saving job:", error); // Log detailed error
      res.status(500).json({
        message: "Error saving job",
        error: error.message || error, // Provide detailed error message
      });
    }
  };

  // Get all Jobs
  module.exports.getAllJobs = async (req, res) => {
    try {
      // Fetch all jobs using Sequelize
      const jobs = await Job.findAll();

      res.status(200).json({ jobs });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Jobs', error: error.message });
    }
  };

  module.exports.addJobApp = async (req, res) => {
    upload(req, res, async (err) => {
      const { name, phone, email, job } = req.body;
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ message: "Error: " + err.message });
      }

      if (!name) {
        return res.status(400).json({ message: "Name is required!" });
      }

      try {
        const updateData = { name, phone, email, job };
        const resume = req.file;
        if (resume) {
          updateData.resume = resume.path;
        }
        updateData.category = "job";

        // const departmentRecord = await Job.findById(job).populate('department', 'id name email');
        const departmentRecord = await Job.findByPk(job, {
          include: {
            model: Department,  // Include the Department model
            attributes: ['id', 'name', 'email']  // Only fetch the id, name, and email of the department
          }
        });
        const departmentId = departmentRecord.Department ? departmentRecord.Department.id : null;
        
        if (!departmentRecord) {
          return res.status(404).json({ message: "Job not found" });
        }
        updateData.department = departmentId;
        const jobapp = await JobApp.create(updateData);
        const departmentEmail = departmentRecord.Department.email ? departmentRecord.Department.email : "";

        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          // host: 'sandbox.smtp.mailtrap.io',
          port: process.env.MAIL_PORT,
          secure: true,
          auth: {
            user: process.env.SERVERNAME,
            pass: process.env.PASSWORD,
          }
        });

        // Define email options
        const mailOptions = {
          from: 'info@quantumcubix.com', // Sender address
          to: departmentEmail, // Recipient (department email)
          subject: `New Job Application: ${name}`, // Email subject
          text: `A new job application has been submitted.\n\n
          Name: ${name}\n
          Phone: ${phone}\n
          Email: ${email}\n
          Job: ${job}\n
          Department: ${departmentRecord.Department.name}`,
        };

        // Email to the User
        const userMailOptions = {
          from: departmentEmail, // Sender address
          to: email, // User's email
          subject: 'Your Job Application Submission', // Email subject
          text: `Dear ${name},\n\nThank you for applying for the ${job} position.\nWe have received your application and will be in touch shortly.\n\nBest regards,\nTeam`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(userMailOptions);
        res.status(201).json({ message: "Application created successfully" });
      } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: "Error saving application " + error });
      }
    });
  };

  // Get a single Job by ID
  module.exports.getJobById = async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch job by id using Sequelize's findOne
      const job = await Job.findOne({
        where: { id },
        include: {
          model: JobApp, // Include the related JobApp model
          required: false, // JobApp is not required, meaning a job can exist without any job applications
        },
      });

      // If job is not found
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Process job applications (if any) and correct image paths
      const jobappWithCorrectImagePath = (job.JobApps || []).map((jobappb) => {
        const correctImagePath = jobappb.resume
          ? jobappb.resume.replace(/\\+/g, "/")
          : null;
        return {
          ...jobappb.toJSON(), // Convert JobApp instance to plain object
          resume: correctImagePath,
        };
      });
      const { JobApps, ...jobWithoutJobApps } = job.toJSON();

      res.status(200).json({ job:jobWithoutJobApps, jobapp: jobappWithCorrectImagePath });
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: 'Error retrieving job and job applications', error: error.message });
    }
  };

  module.exports.getJobByIdFront = async (req, res) => {
    try {
      const job = await Job.findByPk(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json({ job });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving' + error.message });
    }
  };

  // Update a Job by ID
  module.exports.updateJob = async (req, res) => {
    const { title, location, desc, responsb, type, skills, deadline, department, designation, requir, category, status, email } = req.body;
    const { id } = req.params;

    try {
      const job = await Job.findByPk(id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Update the job with new data
      await job.update({
        title,
        location,
        description: desc,
        responsibilities: responsb,
        type,
        skills,
        deadline,
        department,
        designation,
        requirements: requir,
        category,
        status,
        email
      });

      res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating job", error: error.message });
    }
  };

  module.exports.updateJobStatus = async (req, res) => {
    try {
      const job = await Job.findByPk(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      job.status = req.body.status;
      await job.save();

      res.status(200).json({ message: "Job status updated", job });
    } catch (error) {
      res.status(500).json({ message: "Error updating job status", error: error.message });
    }
  };

  module.exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Job', error });
    }
  };