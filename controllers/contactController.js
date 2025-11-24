import Contact from "../models/Contact.js";

export const saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await Contact.create({
      name,
      email,
      message
    });

    res.json({ message: "Message sent successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};