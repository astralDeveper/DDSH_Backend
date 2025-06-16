const Contact = require('../models/Contact.js');
const nodemailer = require('nodemailer');
const yup = require('yup');
const Idea = require('../models/Idea.js');

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  pro_typ: yup.string().required('Project Type is required'),
  phone: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
});
const createIdea = async (req, res) => {
  try {
    const { name, pro_typ,email,phone, } = req.body;
     await contactSchema.validate(req.body, { abortEarly: false });

    const contact = await Idea.create({
      name,
      pro_typ,
      phone,
      email
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
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

        const mailOptions = {
           from: process.env.EMAIL,   // Your Gmail address
          subject: 'Contact Us',
          html: `
          <b>Hi ${capitalized},</b>
            <h3>Thank you for reaching out! We've received your message and will get back to you soon.</h3>
          `,
        };
        
         await  transporter.sendMail({ ...mailOptions, to: email });
    res.status(201).json({ message: 'Idea saved successfully', contact });
  } catch (error) {
     if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Error saving Idea '+ error.message });
  }
};

const getAllIdeas = async (req, res) => {
  try {
    const contacts = await Idea.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact messages', error });
  }
};

const getIdeaById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Idea.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Idea", error });
  }
};

const deleteIdea = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Idea.destroy({ where: { id } });
    if (!deletedContact) {
      return res.status(404).json({ message: 'Idea message not found' });
    }
    res.status(200).json({ message: 'Idea message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Idea message', error });
  }
};


module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  deleteIdea
};