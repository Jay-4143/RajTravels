import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>

                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin relative z-10"></div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-brand font-black text-blue-600 animate-pulse">Raj Travel</h3>
                <p className="text-sm font-tagline font-bold text-gray-400 uppercase tracking-widest mt-1">Preparing your journey...</p>
            </div>
        </div>
    );
};

export default Loading;
