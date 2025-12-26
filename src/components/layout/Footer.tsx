import React from "react";
import { Heart } from "lucide-react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear} FinFlow Expense Tracker. Made with <Heart size={14} />{" "}
          by Daniel
        </p>
        <p className="footer-version">Version 1.0.0 • Open Source</p>
      </div>
    </footer>
  );
};

export default Footer;
