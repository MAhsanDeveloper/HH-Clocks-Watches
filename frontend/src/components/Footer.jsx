import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/contact`)
      .then((res) => setContact(res.data))
      .catch((err) => console.error("Failed to fetch contact info:", err));
  }, []);

  if (!contact) return null;

  return (
    <footer className="bg-black text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Contact Info */}
        <div className="text-center md:text-left space-y-3">
          <h2 className="text-lg font-semibold">Get in Touch</h2>
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 text-gray-300 text-sm">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <FaPhone size={16} /> {contact.phone}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <FaEnvelope size={16} /> {contact.email}
              </a>
            )}
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 justify-center">
        {contact.whatsapp && (
  <a
    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full transition"
  >
    <FaWhatsapp size={18} />
    <span className="text-sm font-medium">Chat with us</span>
  </a>
)}
          {contact.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition"
            >
              <FaInstagram size={18} />
            </a>
          )}
          {contact.facebook && (
            <a
              href={contact.facebook}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
            >
              <FaFacebookF size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Classic Watch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
