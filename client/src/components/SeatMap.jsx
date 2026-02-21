import React, { useState, useEffect } from "react";
import axios from "axios";

const SeatMap = ({ flightId, passengers, selectedSeats, onSeatSelect, isAutoSelect, setIsAutoSelect }) => {
    const [availableSeats, setAvailableSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rows = 20; // Reduced for visibility
    const colLeft = ["A", "B", "C"];
    const colRight = ["D", "E", "F"];

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/flights/${flightId}/seats`);
                if (res.data.success) {
                    setAvailableSeats(res.data.availableSeats);
                }
            } catch (err) {
                setError("Failed to load seat map");
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [flightId]);

    const getSeatPrice = (seatNum) => {
        if (seatNum.includes('A') || seatNum.includes('F')) return 499;
        if (seatNum.includes('C') || seatNum.includes('D')) return 299;
        return 99;
    };

    const handleSeatClick = (seat) => {
        if (isAutoSelect) return;

        if (selectedSeats.includes(seat)) {
            onSeatSelect(selectedSeats.filter((s) => s !== seat));
        } else {
            if (selectedSeats.length < passengers.length) {
                onSeatSelect([...selectedSeats, seat]);
            } else {
                alert(`You can only select ${passengers.length} seats.`);
            }
        }
    };

    const renderSeat = (seatNum) => {
        const isAvailable = availableSeats.includes(seatNum);
        const isSelected = selectedSeats.includes(seatNum);
        const price = getSeatPrice(seatNum);

        let statusClass = "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200";
        if (isAvailable && !isAutoSelect) statusClass = "bg-white border-gray-300 hover:border-blue-500 cursor-pointer";
        if (isSelected && !isAutoSelect) statusClass = "bg-green-600 text-white border-green-600 shadow-md scale-105 z-10";
        if (isAutoSelect) statusClass = "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed";

        return (
            <div
                key={seatNum}
                onClick={() => isAvailable && handleSeatClick(seatNum)}
                className={`group relative w-10 h-10 sm:w-12 sm:h-12 border rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${statusClass}`}
            >
                <span className="text-[10px] sm:text-xs font-bold">{seatNum}</span>
                {isAvailable && (
                    <span className={`text-[8px] mt-0.5 font-bold ${isSelected ? "text-green-100" : "text-gray-400"}`}>
                        ₹{price}
                    </span>
                )}

                {/* Tooltip on hover */}
                {isAvailable && !isAutoSelect && !isSelected && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                        {seatNum.includes('A') || seatNum.includes('F') ? 'Window' : seatNum.includes('C') || seatNum.includes('D') ? 'Aisle' : 'Normal'} - ₹{price}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="text-center py-8">Loading seat map...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Choose Your Seats</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Passenger(s): <span className="font-bold text-gray-900">{passengers.length}</span> |
                        Selected: <span className="font-bold text-blue-600">{selectedSeats.length}</span>
                    </p>
                </div>

                <button
                    onClick={() => {
                        const newVal = !isAutoSelect;
                        setIsAutoSelect(newVal);
                        if (newVal) onSeatSelect([]); // Clear manual selection if auto is picked
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isAutoSelect
                            ? "bg-green-600 text-white shadow-lg shadow-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {isAutoSelect ? "✅ Auto-select Active" : "✨ Auto-select (Free)"}
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-[10px] uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100"><div className="w-3 h-3 border-2 bg-white rounded-md border-gray-200"></div> Available</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100 text-green-700"><div className="w-3 h-3 bg-green-600 rounded-md"></div> Selected</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200 text-gray-400"><div className="w-3 h-3 bg-gray-200 rounded-md"></div> Occupied</div>
            </div>

            <div className="max-w-md mx-auto overflow-y-auto max-h-[500px] border-4 border-gray-50 rounded-[40px] p-6 bg-white relative">
                {/* Cockpit UI */}
                <div className="w-full h-16 bg-gray-50 rounded-t-[100px] mb-12 flex items-center justify-center border-b-2 border-dashed border-gray-200">
                    <span className="text-[10px] font-black text-gray-300 tracking-[0.5em] uppercase">Cockpit / Front</span>
                </div>

                <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`row-left-${i}`} className="flex gap-2">
                                {colLeft.map(col => renderSeat(`${i + 1}${col}`))}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-2">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`ai-${i}`} className="h-10 sm:h-12 flex items-center text-gray-400 font-bold text-[10px]">{i + 1}</div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`row-right-${i}`} className="flex gap-2">
                                {colRight.map(col => renderSeat(`${i + 1}${col}`))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tail UI */}
                <div className="w-full h-12 bg-gray-50 rounded-b-[40px] mt-12 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-200 tracking-[0.2em] uppercase underline decoration-dashed decoration-gray-300">Rear Exit</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
