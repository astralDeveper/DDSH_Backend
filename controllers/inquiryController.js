const Contact = require('../models/Contact.js');
const nodemailer = require('nodemailer');
const yup = require('yup');
const Inquiry = require('../models/Inquiry.js');

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  industry: yup.string().required('Industry is required'),
  phone: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required'),
});
const createInq = async (req, res) => {
    
  try {
    const { name, industry,email,phone,message } = req.body;
     await contactSchema.validate(req.body, { abortEarly: false });
  
     

    const contact = await Inquiry.create({
      name,
      industry,
      phone,
      email,
      message
    });
    await contact.save();
    const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false, // use SSL
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          }
        });
        console.log(transporter);

   
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

        const mailOptions = {
          from: process.env.EMAIL,  // Your Gmail address
          subject: 'Contact Us',
          html: `
            <b>Hi ${capitalized},</b>
            <h3>Thank you for contacting us! We've received your message and appreciate the time you took to share your thoughts.</h3>
            <b>We'll review your inquiry and respond promptly.</b>
          `,
        };
        
         await  transporter.sendMail({ ...mailOptions, to: email });
    res.status(201).json({ message: 'Inquiry saved successfully', contact });
  } catch (error) {
     if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Error saving inquiry '+ error.message });
  }
};

const getAllInquiries = async (req, res) => {
  try {
    const contacts = await Inquiry.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact messages', error });
  }
};

const getInquiryById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Inquiry.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving inquiry", error });
  }
};

const deleteInquiry = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Inquiry.destroy({ where: { id } });
    if (!deletedContact) {
      return res.status(404).json({ message: 'Inquiry message not found' });
    }
    res.status(200).json({ message: 'Inquiry message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry message', error });
  }
};


module.exports = {
  createInq,
  getAllInquiries,
  getInquiryById,
  deleteInquiry
};