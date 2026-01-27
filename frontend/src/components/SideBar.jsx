import "../css/SideBar.css";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCloudSun,
  FaLeaf,
  FaRupeeSign,
  FaLandmark,
} from "react-icons/fa";

const SideBar = ({ isOpen, onClose }) => {
  return (
    <nav
      className={`side-bar ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <Link
        className="nav-link"
        to="/home"
      >
        <FaHome /> Home
      </Link>
      <Link
        className="nav-link"
        to="/weather"
        onClick={onClose}
      >
        <FaCloudSun /> Weather
      </Link>

      <Link
        className="nav-link"
        to="/cropPrices"
        onClick={onClose}
      >
        <FaRupeeSign /> Crop Prices
      </Link>
      <Link
        className="nav-link"
        to="/governmentSchemes"
        onClick={onClose}
      >
        <FaLandmark /> Government Schemes
      </Link>
    </nav>
  );
};

export default SideBar;
