import '../css/TextInput.css'
import { FaSearch } from "react-icons/fa";


const TextInput = ({ query, setQuery, onSearch }) => {

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
        setQuery('');
    };


    return (
        <form className="text-search-box" onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Ask anything..." 
                className="text-inp"
                onChange={handleChange}
                value={query}
            >
            </input>

            <button type="submit" className="search-btn">
                <FaSearch className='search-icon' />
            </button>

        </form>
    );
};

export default TextInput;