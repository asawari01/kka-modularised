import "../css/SideBar.css";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCloudSun,
  FaLeaf,
  FaRupeeSign,
  FaLandmark,
} from "react-icons/fa";
// IMPORT THE HOOK
import { useLanguage } from "../context/LanguageContext";

const SideBar = ({ isOpen, onClose }) => {
  // Get the translation object (t)
  const { t } = useLanguage();

  return (
    <nav
      className={`side-bar ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <Link
        className="nav-link"
        to="/home"
      >
        <FaHome /> {t.nav.home}
      </Link>

      <Link
        className="nav-link"
        to="/weather"
        onClick={onClose}
      >
        <FaCloudSun /> {t.nav.weather}
      </Link>

      <Link
        className="nav-link"
        to="/cropPrices"
        onClick={onClose}
      >
        <FaRupeeSign /> {t.nav.cropPrices}
      </Link>

      <Link
        className="nav-link"
        to="/governmentSchemes"
        onClick={onClose}
      >
        <FaLandmark /> {t.nav.schemes}
      </Link>
    </nav>
  );
};

export default SideBar;
