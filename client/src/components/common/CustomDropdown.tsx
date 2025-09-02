import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  subtitle?: string;
}

interface CustomDropdownProps {
  autoFocus?: boolean;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  searchable?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  autoFocus = false,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  error = false,
  className = "",
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setIsSearching(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      if (searchable) {
        setIsSearching(true);
        setSearchTerm("");
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const currentScrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo(0, currentScrollTop);
          }
        }, 10);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!searchable) return;

    const newValue = e.target.value;
    setSearchTerm(newValue);

    if (newValue === "") {
      onChange("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionClick(filteredOptions[0].value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setIsSearching(false);
      setSearchTerm("");
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isOpen) {
        setIsSearching(false);
        setSearchTerm("");
      }
    }, 150);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.scrollIntoView({ block: "nearest" });
  };

  const displayValue =
    searchable && isSearching
      ? searchTerm
      : selectedOption
        ? selectedOption.label
        : "";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field */}
      <div className="relative">
        <input
          autoFocus={autoFocus}
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!searchable}
          className={`rounded-none w-full px-3 py-2 border shadow-sm focus:outline-none focus:outline-orange-500 focus:ring-0 focus:ring-orange-500 ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          } ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-orange-500"
          } ${!searchable ? "cursor-pointer" : ""}`}
        />

        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Selected Option Subtitle */}
        {!isSearching && selectedOption && selectedOption.subtitle && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-xs text-gray-500">
              {selectedOption.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-hidden">
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-150 ${
                    option.value === value
                      ? "bg-orange-100 text-orange-900"
                      : "text-gray-900"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-xs text-gray-500">
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
