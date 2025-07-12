const Contact = require('../models/Contact.js');
const nodemailer = require('nodemailer');
const yup = require('yup');

const contactSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email is required'),
  reason: yup
    .mixed()
    .test('is-valid-reason', 'Reason must be a string or an array', value =>
      typeof value === 'string' || Array.isArray(value)
    )
    .required(),
  message: yup.string().required('Message is required'),
});
const createContactMessage = async (req, res) => {
  try {
    const { first_name, last_name,email,phone, reason, message } = req.body;
     await contactSchema.validate(req.body, { abortEarly: false });
  let parsedReason;

  if (Array.isArray(reason)) {
    parsedReason = reason;
  } else if (typeof reason === 'string') {
    parsedReason = reason.split(',').map(r => r.trim());
  } else {
    parsedReason = [String(reason)];
  }

    const contact = await Contact.create({
      first_name,
      last_name,
      phone,
      email,
      reason: parsedReason,
      message
    });
    await contact.save();
    const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false, // use SSL
          auth: {
            user: process.env.SERVERNAME,
            pass: process.env.PASSWORD,
          }
        });
        const capitalized = first_name.charAt(0).toUpperCase() + first_name.slice(1);
        const mailOptions = {
          from: 'info@quantumcubix.com',  // Your Gmail address
          subject: 'Contact Us',
          html: `
            <b>Hi ${capitalized} ${last_name},</b>
            <h3>Thank you for reaching out! We've received your message and will get back to you soon.</h3>
          `,
        };
        
         await  transporter.sendMail({ ...mailOptions, to: email });
    res.status(201).json({ message: 'Contact message saved successfully', contact });
  } catch (error) {
     if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Error saving contact message '+ error.message });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact messages', error });
  }
};

const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving contact", error });
  }
};

const deleteContactMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.destroy({ where: { id } });
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message', error });
  }
};


module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactById,
  deleteContactMessage
};