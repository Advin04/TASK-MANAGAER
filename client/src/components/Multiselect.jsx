import React, { useState } from 'react';

const Multiselect = ({ options, selected, onChange, placeholder, id }) => {
    const [dropdown, setDropdown] = useState(false);

    const toggleDropdown = () => setDropdown(!dropdown);

    const addTag = (item) => {
        if (!selected.find((s) => s.value === item.value)) {
            onChange([...selected, item]); // Add the full object
        }
        setDropdown(false);
    };

    const removeTag = (item) => {
        onChange(selected.filter((s) => s.value !== item.value));
    };

    return (
        <div className="autocomplete-wrapper relative">
            <div className="autocomplete">
                <div className="flex flex-wrap items-center border rounded-md p-1 bg-transparent border-blue-gray-200 dark:border-gray-800">
                    {selected.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center m-1 py-1 px-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full"
                        >
                            <span className="text-xs">{tag.label}</span>
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-primary-700 dark:text-primary-400 hover:text-primary-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <input
                        id={id}
                        placeholder={placeholder}
                        className="flex-1 p-1 outline-0 outline text-black dark:text-white font-sans cursor-pointer caret-transparent bg-transparent placeholder:text-gray-400"
                        onFocus={toggleDropdown}
                    />
                </div>
                {dropdown && (
                    <div className="absolute shadow-xl bg-white dark:bg-dark-bg z-40 w-full rounded-lg max-h-48 overflow-y-auto border border-gray-100 dark:border-gray-900 mt-1 pb-1">
                        {options.map((item, key) => (
                            <div
                                key={key}
                                className="cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-dark-secondary text-gray-800 dark:text-gray-200 text-sm transition-colors border-b border-gray-50 dark:border-gray-900/50 last:border-0"
                                onClick={() => addTag(item)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Multiselect;