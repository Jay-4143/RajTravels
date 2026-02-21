import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTicket = (booking, type) => {
    if (!booking) {
        console.error("No booking data provided to generateTicket");
        return;
    }
    const doc = new jsPDF();
    const primaryColor = [37, 99, 235]; // Blue 600
    const accentColor = [220, 38, 38]; // Red 600

    // Helper: Header
    const addHeader = (title) => {
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('TravelGO', 15, 25);
        doc.setFontSize(14);
        doc.text(title, 15, 35);

        // Ticket Reference
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const ref = booking.bookingReference || booking.pnr || booking.bookingId || booking._id;
        doc.text(`Reference: ${ref}`, 140, 25);
        doc.text(`Issued On: ${new Date().toLocaleString()}`, 140, 32);
    };

    // Helper: Footer
    const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('TravelGO Customer Support: +91 1800-TRAVEL-GO | help@travelgo.com', 105, 285, { align: 'center' });
            doc.text('Scan for support or visit travelgo.com/help', 105, 290, { align: 'center' });
        }
    };

    const addInstructions = (instructs) => {
        const y = doc.lastAutoTable.finalY + 25;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Important Instructions:', 15, y);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        instructs.forEach((text, i) => {
            doc.text(`• ${text}`, 15, y + 8 + (i * 5));
        });
    };

    if (type === 'flight') {
        addHeader('OFFICIAL E-TICKET: FLIGHT');

        autoTable(doc, {
            startY: 55,
            head: [['Airline', 'Flight No', 'From', 'To', 'Departure', 'Arrival']],
            body: booking.itineraries ? booking.itineraries.map(it => [
                it.airline,
                it.flightNumber || '---',
                it.from,
                it.to,
                new Date(it.departureTime).toLocaleString('en-IN'),
                new Date(it.arrivalTime).toLocaleString('en-IN')
            ]) : [
                [
                    booking.flightDetails?.airline || booking.flight?.airline || 'Flight',
                    booking.flightDetails?.flightNumber || booking.flight?.flightNumber || '---',
                    booking.flightDetails?.from || booking.flight?.from,
                    booking.flightDetails?.to || booking.flight?.to,
                    new Date(booking.flightDetails?.departureTime || booking.flight?.departureTime).toLocaleString('en-IN'),
                    new Date(booking.flightDetails?.arrivalTime || booking.flight?.arrivalTime).toLocaleString('en-IN')
                ]
            ],
            theme: 'grid',
            headStyles: { fillColor: primaryColor }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Passenger Name', 'Age', 'Seat No.', 'Class']],
            body: (booking.passengers || []).map(p => [
                p.name,
                p.age,
                p.seatNumber || p.seat || 'Assigned at Check-in',
                booking.class || 'Economy'
            ]),
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Check-in counters close 60 minutes before departure.',
            'Please carry a valid government-issued photo ID.',
            'Baggage allowance: 15kg Check-in, 7kg Cabin (Standard).',
            'Meal selections and add-ons are subject to availability.'
        ]);

    } else if (type === 'hotel') {
        addHeader('BOOKING VOUCHER: HOTEL');

        autoTable(doc, {
            startY: 55,
            head: [['Hotel Name', 'Location', 'Check-In', 'Check-Out']],
            body: [[
                booking.hotel?.name || booking.hotelName || '---',
                booking.hotel?.city || booking.hotelLocation || '---',
                new Date(booking.checkIn).toDateString(),
                new Date(booking.checkOut).toDateString()
            ]],
            headStyles: { fillColor: primaryColor }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Room Type', 'Guests', 'Status']],
            body: [[
                booking.room?.name || booking.roomName || 'Standard Room',
                booking.guests || booking.guestCount || (booking.guestNames?.length) || '---',
                'Confirmed'
            ]],
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Standard check-in time is 2:00 PM.',
            'Hotel may require a security deposit upon arrival.',
            'All guests must provide ID proof (Aadhar/Passport).',
            'For late arrival, please contact the hotel directly.'
        ]);

    } else if (type === 'bus') {
        addHeader('E-TICKET: BUS JOURNEY');

        autoTable(doc, {
            startY: 55,
            head: [['Operator', 'From', 'To', 'Travel Date', 'Time']],
            body: [[
                booking.busName || booking.bus?.busName || booking.bus || 'Express Service',
                booking.from,
                booking.to,
                new Date(booking.travelDate).toDateString(),
                booking.departureTime
            ]],
            headStyles: { fillColor: primaryColor }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Passenger Name', 'Seat No.', 'Gender']],
            body: (booking.passengers || [{ name: booking.passengerName, seatNumber: booking.seats?.join(', '), gender: '---' }]).map(p => [
                p.name || booking.passengerName,
                p.seatNumber || (booking.seats ? booking.seats.join(', ') : '---'),
                p.gender || '---'
            ]),
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Please reach the boarding point 15 mins before.',
            'M-Ticket or Print-out is mandatory for boarding.',
            'Luggage limit: 20kg per passenger.',
            'Contact operator for pickup point updates.'
        ]);

    } else if (type === 'cab') {
        addHeader('CAB BOOKING CONFIRMATION');

        autoTable(doc, {
            startY: 55,
            head: [['Vehicle', 'Pickup Location', 'Drop Location', 'Pickup Date', 'Time']],
            body: [[
                booking.cab?.vehicleName || booking.vehicleName || 'SUV/Sedan',
                booking.pickupLocation || booking.pickupAddress,
                booking.dropLocation || booking.dropAddress,
                new Date(booking.pickupDate).toDateString(),
                booking.pickupTime
            ]],
            headStyles: { fillColor: primaryColor }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Passenger', 'Contact', 'Ride Type']],
            body: [[
                booking.userName || booking.contactDetails?.name || 'Customer',
                booking.userPhone || booking.contactDetails?.phone || '---',
                booking.tripType || 'One-way'
            ]],
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Driver details will be shared 2 hours before pickup.',
            'Waiting charges apply after first 15 mins.',
            'Toll and Parking charges are extra if not included.',
            'Smoking is strictly prohibited inside the vehicle.'
        ]);

    } else if (type === 'cruise') {
        addHeader('BOARDING PASS: CRUISE');

        autoTable(doc, {
            startY: 55,
            head: [['Cruise Name', 'Departure Port', 'Sailing Date', 'Duration']],
            body: [[
                booking.cruise?.name || booking.name || 'Voyager Express',
                booking.cruise?.departurePort || booking.departurePort || '---',
                new Date(booking.travelDate || booking.departureDate).toDateString(),
                `${booking.cruise?.duration || booking.duration || '---'} Days`
            ]],
            headStyles: { fillColor: primaryColor }
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Guest Name', 'Cabin Type', 'Guests']],
            body: (booking.guests || []).map(g => [g.name, booking.cabin?.name || 'Standard', booking.guests.length]),
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Mandatory health check 3 hours before sailing.',
            'Carry your Passport and Visa if international.',
            'Luggage tags must be attached before boarding.',
            'Alcohol is not permitted from outside.'
        ]);

    } else if (type === 'package') {
        addHeader('HOLIDAY VOUCHER: TOUR');

        autoTable(doc, {
            startY: 55,
            head: [['Package Name', 'Destination', 'Start Date', 'Pax']],
            body: [[
                booking.title || booking.package?.title || booking.package?.name || 'Golden Triangle Tour',
                booking.destination || booking.package?.destination || '---',
                new Date(booking.travelDate).toDateString(),
                booking.numberOfPeople || booking.packageParticipants || '---'
            ]],
            headStyles: { fillColor: primaryColor }
        });

        addInstructions([
            'Welcome kit will be provided at the airport.',
            'Itinerary is subject to weather conditions.',
            'Keep your TravelGO holiday manager contact handy.',
            'Tipping is voluntary but appreciated by guides.'
        ]);
    }

    // Common Section: Price
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${(booking.totalAmount || booking.totalFare || 0).toLocaleString('en-IN')}`, 15, finalY + 10);

    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94); // Green 500
    doc.text('Status: PAID & CONFIRMED ✅', 15, finalY + 18);

    addFooter();
    const fileName = `TravelGO_${type}_${booking.bookingReference || booking.pnr || booking.id || booking._id}.pdf`;
    doc.save(fileName.replace(/\s+/g, '_'));
};
