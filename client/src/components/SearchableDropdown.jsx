import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSearch, FaTimes } from 'react-icons/fa';

const SearchableDropdown = ({
    options,
    value,
    onChange,
    placeholder,
    label,
    icon: Icon = FaMapMarkerAlt,
    iconColor = "text-blue-500",
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {label}
            </label>

            <div
                className={`relative group cursor-pointer transition-all ${isOpen ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold flex items-center min-h-[58px]">
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`} />
                    <span className={value ? "text-slate-900" : "text-slate-400"}>
                        {value || placeholder}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-[100] top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-50">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-100"
                                placeholder="Search city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-[250px] overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-600 ${value === option ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400 text-xs">
                                No cities found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
