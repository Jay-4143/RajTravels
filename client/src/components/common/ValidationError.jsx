import React from 'react';

const ValidationError = ({ message }) => {
    if (!message) return null;

    return (
        <p className="text-[10px] font-bold text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {message}
        </p>
    );
};

export default ValidationError;
