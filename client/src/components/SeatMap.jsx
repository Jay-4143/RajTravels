import React, { useState, useEffect } from "react";
import axios from "axios";

const SeatMap = ({ flightId, passengers, selectedSeats, onSeatSelect }) => {
    const [availableSeats, setAvailableSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Generate a mock grid - in a real app, this might come from the DB
    // Assuming 30 rows for a typical narrow-body aircraft
    const rows = 30;
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

    const handleSeatClick = (seat) => {
        // If seat is already selected, deselect it
        if (selectedSeats.includes(seat)) {
            onSeatSelect(selectedSeats.filter((s) => s !== seat));
        } else {
            // If we haven't selected enough seats yet, add it
            if (selectedSeats.length < passengers.length) {
                onSeatSelect([...selectedSeats, seat]);
            } else {
                // Optional: Allow changing selection by clicking a new one? 
                // For now, simple logic: alert if full
                alert(`You can only select ${passengers.length} seats.`);
            }
        }
    };

    const renderSeat = (seatNum) => {
        const isAvailable = availableSeats.includes(seatNum);
        const isSelected = selectedSeats.includes(seatNum);

        // Logic: If not available, it's occupied. 
        // However, since our controller generates "availableSeats" dynamically based on a count,
        // and doesn't track specific booked seats in a persistent way yet (dummy logic in controller),
        // we might need to rely on the controller's logic primarily.
        // Controller logic: "if (!bookedSeats.includes(seat)) availableSeats.push(seat)"
        // So if it's in availableSeats, it's free. If not, it's taken.

        let statusClass = "bg-gray-300 cursor-not-allowed"; // Occupied default
        if (isAvailable) statusClass = "bg-white border-gray-300 hover:border-blue-500 cursor-pointer";
        if (isSelected) statusClass = "bg-green-500 text-white border-green-500";

        return (
            <div
                key={seatNum}
                onClick={() => isAvailable && handleSeatClick(seatNum)}
                className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${statusClass}`}
                title={seatNum}
            >
                {seatNum}
            </div>
        );
    };

    if (loading) return <div className="text-center py-8">Loading seat map...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Select Seats</h3>
            <div className="flex justify-between items-center mb-6 text-sm">
                <p>Passenger(s): {passengers.length} | Selected: {selectedSeats.length}</p>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 border bg-white rounded"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Occupied</div>
                </div>
            </div>

            <div className="max-w-xs mx-auto overflow-y-auto max-h-[500px] border p-4 rounded-xl bg-gray-50">
                {/* Front of plane */}
                <div className="w-full h-0 border-l-[100px] border-r-[100px] border-b-[50px] border-l-transparent border-r-transparent border-b-gray-200 mb-8 relative">
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-xs">COCKPIT</span>
                </div>

                <div className="flex justify-between gap-4 sm:gap-8">
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`row-left-${i}`} className="flex gap-1 sm:gap-2">
                                {colLeft.map(col => renderSeat(`${i + 1}${col}`))}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-2">
                        {/* Aisle numbers */}
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`ai-${i}`} className="h-8 sm:h-10 flex items-center text-gray-300 text-xs">{i + 1}</div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={`row-right-${i}`} className="flex gap-1 sm:gap-2">
                                {colRight.map(col => renderSeat(`${i + 1}${col}`))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
