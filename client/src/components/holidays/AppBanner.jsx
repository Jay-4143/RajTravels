import React from 'react';

const AppBanner = () => {
    return (
        <section className="mb-20">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

                {/* Left Side: Mockup Phones */}
                <div className="hidden lg:block w-1/3 relative h-64 md:h-auto">
                    <img
                        src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80"
                        alt="Mobile App"
                        className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[120%] object-cover opacity-20 transform -rotate-12"
                    />
                    {/* Placeholder for actual phone mockups since we don't have local assets */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="w-48 h-80 bg-gray-900 rounded-3xl border-8 border-gray-800 shadow-2xl transform -rotate-12 translate-x-8 overflow-hidden z-20">
                            <div className="w-full h-full bg-blue-100 p-4">
                                <div className="w-full h-12 bg-blue-500 rounded flex items-center px-4"><span className="text-white font-bold">RajTravel</span></div>
                                <div className="w-full h-24 bg-white rounded mt-4"></div>
                                <div className="w-full h-24 bg-white rounded mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: Features */}
                <div className="p-8 md:p-12 pb-8 flex-1 flex flex-col justify-center text-white z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-shadow">Travel like a pro – Download & go!</h2>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">✓</span>
                            <span className="font-medium text-lg">Instant booking</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">✓</span>
                            <span className="font-medium text-lg">Manage your Booking</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">✓</span>
                            <span className="font-medium text-lg">Real time Updates</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">✓</span>
                            <span className="font-medium text-lg">Exclusive Deals</span>
                        </li>
                    </ul>

                    <div className="mt-auto">
                        <p className="text-blue-100 font-bold mb-2">1.9M+ Downloads & Counting..</p>
                        <div className="flex text-yellow-400 text-lg">
                            ★★★★★ <span className="text-white text-sm ml-2 font-medium">4.6/5- Ratings</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: QR & Stores */}
                <div className="bg-blue-50/90 w-full md:w-[400px] p-8 md:p-12 flex flex-col items-center justify-center text-center rounded-l-[100px] relative">
                    <div className="bg-white p-3 rounded-2xl shadow-lg mb-6 max-w-[150px]">
                        {/* Mock QR Code */}
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://rajtravel.com/app" alt="QR Code" className="w-full h-auto" />
                    </div>

                    <p className="text-gray-600 text-sm font-medium mb-6">Scan the QR Code to download the RajTravel Mobile App</p>

                    <div className="flex gap-2 justify-center w-full">
                        <button className="bg-gray-900 text-white rounded-lg flex items-center gap-2 px-3 py-2 flex-1 justify-center hover:bg-black transition-colors">
                            {/* Play Store Icon placeholder */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                            <div className="text-left">
                                <div className="text-[8px] leading-none text-gray-300">GET IT ON</div>
                                <div className="text-xs font-bold leading-tight">Google Play</div>
                            </div>
                        </button>
                        <button className="bg-gray-900 text-white rounded-lg flex items-center gap-2 px-3 py-2 flex-1 justify-center hover:bg-black transition-colors">
                            {/* App Store Icon placeholder */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13.03 4.24c.73-.89 1.23-2.13 1.09-3.36-1.09.04-2.38.73-3.14 1.63-.68.8-1.28 2.08-1.12 3.29 1.22.09 2.43-.66 3.17-1.56z" /></svg>
                            <div className="text-left">
                                <div className="text-[8px] leading-none text-gray-300">Download on the</div>
                                <div className="text-xs font-bold leading-tight">App Store</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppBanner;
