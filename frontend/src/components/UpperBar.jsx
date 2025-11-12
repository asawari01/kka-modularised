import '../css/UpperBar.css'
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";

const UpperBar = ({ onMenuClick }) => {
    return (
        <nav className="upper-bar">
            <button type='button' className='burger-menu' onClick={onMenuClick}>
                <RxHamburgerMenu />
            </button>

            <Link to='/home' className="main-page-title">
                Kisaan Ki Aawaaz
            </Link>
            
            <div className="language-selector">
                <button className="lang-btn" type="button"> English </button>
            </div>
        </nav>
    );

}

export default UpperBar;