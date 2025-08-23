// components/DropdownSelect.js (or .jsx)
import React, { useRef, useEffect, useCallback } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

// Define option types outside the component if they are static
// You might already have these in your main AddAssetForm component,
// but they are included here for completeness if this component
// were to be used standalone or if you want to keep them with the dropdown.

// Example:
// const typeOptions = [
//   { label: "Desktop", description: "Desktop Computer" },
//   { label: "Laptop", description: "Laptop Computer" },
//   { label: "Printer", description: "Printer Device" },
//   { label: "Server", description: "Server Hardware" },
//   { label: "Network Device", description: "Network Equipment" },
// ];

// const statusOptions = [
//   { label: "MISStock", description: "...", color: "text-green-500" },
//   { label: "New Purchase", description: "...", color: "text-red-500" },
//   // ... other status options
// ];

// const conditionOptions = [
//   { label: "Excellent" },
//   { label: "Good" },
//   { label: "Fair" },
//   { label: "Bad" }
// ];


const DropdownSelect = React.forwardRef(({
  id,
  label,
  value,
  options,
  onChange, // For input field changes (e.g., for type where user can type)
  onSelect, // For when an option is clicked from the dropdown list
  error,
  inputIcon,
  inputHelp,
  placeholder,
  readOnly = false, // Set to true for dropdowns where typing is not allowed (e.g., Status, Condition)
  toggleOpen, // Function to toggle the dropdown's open state
  isOpen,     // Boolean indicating if the dropdown is currently open
  required = false
}, ref) => { // 'ref' is the ref passed by the parent component via React.forwardRef
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="input-group" ref={ref}> {/* Attach the forwarded ref to the main input-group div */}
        <span className="input-icon">{inputIcon}</span>
        <input
          type="text"
          id={id}
          value={value || ""}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`form-input pl-10 ${error ? "error" : ""}`}
          onClick={toggleOpen} // Open dropdown on input click
          onChange={onChange} // Allow typing if readOnly is false
        />
        <span className="input-suffix" onClick={toggleOpen}>
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
        {isOpen && (
          <div className="dropdown-menu">
            {/* Filter options if onChange is used for typing, otherwise show all */}
            {options
              .filter(option =>
                readOnly || !value || option.label.toLowerCase().includes(value.toLowerCase())
              )
              .map((option) => (
                <div
                  key={option.label}
                  onClick={() => onSelect(option.label)} // Call onSelect when an option is clicked
                  className="dropdown-item"
                >
                  {option.label}
                  {/* Display status specific icons/colors if applicable */}
                  {option.color && (
                    <span className={`ml-2 ${option.color}`}>
                      {option.label === "MISStock" || option.label === "Deployed" ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
      {error && <p className="input-error">{label} is required</p>}
      {inputHelp && <p className="input-help">{inputHelp}</p>}
    </div>
  );
});

// Export the component wrapped with React.forwardRef
export default DropdownSelect;