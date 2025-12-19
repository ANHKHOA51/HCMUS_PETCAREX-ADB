import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, placeholder = "Search...", debounceTime = 500, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);

    // Cleanup function to cancel the timeout if searchTerm changes (classic debounce)
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
