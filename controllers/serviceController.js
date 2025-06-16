const multer = require('multer');
const Service = require('../models/Service');
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/services"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
// const storage =ProductStorage;

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 2 * 1024 * 1024,  // 2MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
    }
  }
}).fields([
  { name: "img1", maxCount: 1 },
  { name: "img2", maxCount: 1 },
  { name: "img3", maxCount: 1 },
  { name: "img4", maxCount: 1 },
  { name: "img5", maxCount: 1 },
  { name: "img6", maxCount: 1 },
  { name: "img7", maxCount: 1 },
  { name: "img8", maxCount: 1 }
]);

// Create service
const createService = async (req, res) => {
  upload(req, res, async (err) => {
  try {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }
    const {name,desc,head1,head2,head3,desc1,desc2,desc3,stage1_head,stage2_head,stage3_head,stage4_head,stage5_head,stage6_head,stage7_head,stage1_desc,stage2_desc,stage3_desc,stage4_desc,stage5_desc,stage6_desc,stage7_desc}=req.body;
    let imagePathimg1,imagePathimg2,imagePathimg3,imagePathimg4,imagePathimg5,imagePathimg6,imagePathimg7,imagePathimg8; 
    const img1 = req.files['img1'] ? req.files['img1'][0] : null;
    const img2 = req.files['img2'] ? req.files['img2'][0] : null;
    const img3 = req.files['img3'] ? req.files['img3'][0] : null;
    const img4 = req.files['img4'] ? req.files['img4'][0] : null;
    const img5 = req.files['img5'] ? req.files['img5'][0] : null;
    const img6 = req.files['img6'] ? req.files['img6'][0] : null;
    const img7 = req.files['img7'] ? req.files['img7'][0] : null;
    const img8 = req.files['img8'] ? req.files['img8'][0] : null;

      if (img1) {
        imagePathimg1 = img1.path;
      }
      
      if (img2) {
        imagePathimg2 = img2.path;
      }
      if (img3) {
        imagePathimg3 = img3.path;
      }
      if (img4) {
        imagePathimg4 = img4.path;
      }
      if (img5) {
        imagePathimg5 = img5.path;
      }
      if (img6) {
        imagePathimg6 = img6.path;
      }
      if (img7) {
        imagePathimg7 = img7.path;
      }
      if (img8) {
        imagePathimg8 = img8.path;
      }

    const service = new Service({
      name,desc,head1,head2,head3,desc1,desc2,desc3,stage1_head,stage2_head,stage3_head,stage4_head,stage5_head,stage6_head,stage7_head,stage1_desc,stage2_desc,stage3_desc,stage4_desc,stage5_desc,stage6_desc,stage7_desc,img1:imagePathimg1,img2:imagePathimg2,img3:imagePathimg3,img4:imagePathimg4,img5:imagePathimg5,img6:imagePathimg6,img7:imagePathimg7
    });
    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
});
};

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const updatedServices = services.map(service => {
      const serviceData = service.toJSON();

      for (let i = 1; i <= 8; i++) {
        const imgKey = `img${i}`;
        if (serviceData[imgKey]) {
          serviceData[imgKey] = `${baseUrl}/${serviceData[imgKey].replace(/\\/g, '/')}`;
        }
      }

      return serviceData;
    });

    res.status(200).json(updatedServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};


// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully', updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};