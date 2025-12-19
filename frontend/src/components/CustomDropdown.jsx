import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomDropdown Component
 * 
 * @param {string} label - Label for the dropdown
 * @param {Array} options - List of options to display
 * @param {any} value - Current selected value (ID or object)
 * @param {Function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text
 * @param {string} valueKey - Key to use for the value (default: 'id')
 * @param {string} labelKey - Key to use for the label (default: 'name')
 * @param {Function} renderOption - Optional custom renderer for options
 */
const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  valueKey = "id",
  labelKey = "name",
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt[valueKey] === value);

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <div className="flex-1 text-left">
          {selectedOption ? (
            renderOption ? (
              renderOption(selectedOption)
            ) : (
              <span className="text-gray-900 font-medium">
                {selectedOption[labelKey]}
              </span>
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-2">
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = option[valueKey] === value;
                return (
                  <li
                    key={option[valueKey]}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between group
                      ${isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex-1">
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <span className={`block truncate ${isSelected ? "font-semibold" : "font-normal"}`}>
                          {option[labelKey]}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 ml-2" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-gray-400 text-center text-sm">
                No options available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
