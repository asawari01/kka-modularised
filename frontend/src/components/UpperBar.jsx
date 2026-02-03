import "../css/UpperBar.css";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
// IMPORT THE HOOK
import { useLanguage } from "../context/LanguageContext";

const UpperBar = ({ onMenuClick }) => {
  // Get language state and functions
  const { language, switchLanguage, t } = useLanguage();

  return (
    <nav className="upper-bar">
      <button
        type="button"
        className="burger-menu"
        onClick={onMenuClick}
      >
        <RxHamburgerMenu />
      </button>

      {/* Title is now dynamic */}
      <Link
        to="/home"
        className="main-page-title"
      >
        {t.appTitle}
      </Link>

      <div className="language-selector">
        {/* Dynamic Dropdown */}
        <select
          className="lang-btn"
          value={language}
          onChange={(e) => switchLanguage(e.target.value)}
          style={{ cursor: "pointer", appearance: "none", textAlign: "center" }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>
    </nav>
  );
};

export default UpperBar;
